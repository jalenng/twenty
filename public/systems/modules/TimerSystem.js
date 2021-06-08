/**
 * @file Handles the timing and logic of the timer functionality.
 * @author jalenng
 *
 * The states of the timers and its transitions are shown here:
 *
 * 0 : false :: 1 : true
 *
 *                 +--------------------------------------+
 *                 |              isStopped               |
 *                 +-----------------------+--------------+
 *                 |           0           |       1      |
 * +-----------+---+-----------------------+--------------+
 * |           |   | +-------------------+ |              |
 * |           |   | | isIdle            | |              |
 * |           |   | +-------------------+ |              |
 * |           |   | |    0    |    1    | |              |  /\          |
 * |           | 0 | +-------------------+ |   Stopped    |  |           |
 * | isBlocked |   | | Running |  Idle   | |              |  |           |
 * |           |   | +-------------------+ |              |  |           |
 * |           |   |    <----Start-----    |              |  | Unblock   | Block
 * |           |   |    ------End----->    |              |  |           |
 * |           +---+-----------------------+--------------+  |           |
 * |           |   |                       |    Blocked   |  |           |
 * |           | 1 |        Blocked        |      and     |  |           \/
 * |           |   |                       |    stopped   |
 * +-----------+---+-----------------------+--------------+
 *                             <-------Start--------
 *                             --------Pause------->
 *
 *                             <-------Toggle------>
 *
 * - Running:           the timer is counting down.
 * - Idle:              the timer has finished its countdown and is waiting to restart automatically.
 * - Blocked:           the timer is not counting down because of a blocker.
 * - Stopped:           the timer is not counting down because it was stopped manually.
 * - Blocked & stopped: the timer was blocked when it was stopped.
 *
 * The timer system is also an event emitter that emits the following events:
 *     - timer-end: when the timer counts down to zero, or is manually ended.
 *
 */

const EventEmitter = require('./EventEmitter')
const store = require('../../store/store')

/** Timer states */
const states = {
  RUNNING: 'running',
  IDLE: 'idle',
  BLOCKED: 'blocked',
  STOPPED: 'stopped',
  BLOCKED_AND_STOPPED: 'blocked_and_stopped'
}

/**
 * Initializes a TimerSystem.
 * @class
 */
module.exports = class TimerSystem extends EventEmitter {
  constructor () {
    super()

    // Flags and variables to track timer status
    this.isStopped = true
    this.isBlocked = false
    this.isIdle = false

    // The Date Object indicating when the timer will end
    this.endDate = new Date()

    // The total duration of the timer run in milliseconds
    this.totalDuration = store.get('preferences.notifications.interval') * 60000

    // Stores the remaining time when the timer is stopped or blocked (TODO: Depreciate this)
    this.savedTime = this.totalDuration

    // Start timer on app startup if enabled in preferences
    if (store.get('preferences.startup.startTimerOnAppStartup')) {
      this.start()
    }
  }

  /**
   * Gets the state of the timer.
   * @returns a string indicating the state.
   */
  getState () {
    if (this.isStopped) {
      if (this.isBlocked) {
        return states.BLOCKED_AND_STOPPED
      } else {
        return states.STOPPED
      }
    } else {
      if (this.isBlocked) {
        return states.BLOCKED
      } else if (this.isIdle) {
        return states.IDLE
      } else {
        return states.RUNNING
      }
    }
  }

  /**
   * Gets the status of the timer system
   * @returns an object
   */
  getStatus () {
    return {
      endDate: this.endDate,
      totalDuration: this.totalDuration,
      remainingTime: (() => {
        if (this.savedTime != null) return this.savedTime // Use this only if the timer is stopped or blocked
        else return this.endDate - new Date() // Otherwise, calculate it dynamically
      })(),
      isBlocked: this.isBlocked,
      isStopped: this.isStopped,
      isIdle: this.isIdle
    }
  };

  /**
   * Updates the timer.
   */
  update () {
    switch (this.getState()) {
      case states.RUNNING:
        if (this.savedTime === 0) this.reset()
        else this.setup()

        break

      // End timer and begin break
      case states.IDLE:

        this.savedTime = 0
        clearTimeout(this.timeout)

        this.emit('timer-end', callback => callback(this.totalDuration))

        break

      // The timer should not be running here
      case states.BLOCKED:
      case states.BLOCKED_AND_STOPPED:
      case states.STOPPED:

        this.totalDuration = store.get('preferences.notifications.interval') * 60000
        this.savedTime = this.totalDuration
        clearTimeout(this.timeout)

        break
    }

    this.resetSendingInterval()
  }

  /**
   * Sets up the timer
   */
  setup () {
    // Use JS timeouts to facilitate delay
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.end.bind(this), this.savedTime)

    // Calculate the end date
    this.endDate = new Date()
    const msLeft = this.endDate.getMilliseconds() + this.savedTime
    this.endDate.setMilliseconds(msLeft)

    this.savedTime = null
  }

  /**
   * Resets the interval for sending timer updates
   */
  resetSendingInterval () {
    clearInterval(this.sendingInterval)

    if (global.mainWindow && !global.mainWindow.isDestroyed()) { global.mainWindow.webContents.send('receive-timer-status', this.getStatus()) }

    this.sendingInterval = setInterval(() => {
      if (global.mainWindow && !global.mainWindow.isDestroyed()) { global.mainWindow.webContents.send('receive-timer-status', this.getStatus()) }
    }, 1000)
  }

  /**
   * Resets the timer
   */
  reset () {
    this.totalDuration = store.get('preferences.notifications.interval') * 60000
    this.savedTime = this.totalDuration

    if (this.getState() === states.RUNNING) this.setup()
  }

  /**
   * Starts the timer
   */
  start () {
    if (this.isBlocked) return
    if (this.getState() === states.RUNNING) return

    // Set flags
    this.isIdle = false
    this.isStopped = false

    this.update()
  };

  /**
   * Ends the timer and starts the break
   */
  end () {
    if (this.isBlocked) return
    if (this.isIdle) return

    // Set flags
    this.isIdle = true
    this.isStopped = false

    this.update()
  };

  /**
   * Pauses the timer
   */
  // Conditions to ignore
  stop () {
    if (this.isStopped) return

    // Set flags
    this.isIdle = false
    this.isStopped = true

    this.update()
  }

  /**
   * Blocks the timer from running
   */
  block () {
    if (this.isBlocked) return

    // Set flag
    this.isBlocked = true

    this.update()
  }

  /**
   * Unblocks the timer from running
   */
  unblock () {
    if (!this.isBlocked) return

    // Set flag
    this.isBlocked = false

    this.update()
  }

  /**
   * Pauses the timer if the timer is running,
   * or starts the timer when it is stopped or blocked.
   */
  togglePause () {
    if (this.isStopped) { this.start() } else { this.stop() }
  }
}

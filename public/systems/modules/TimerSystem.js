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
    this.durationOverride = null

    // The Date Object indicating when the timer will end
    this.endDate = new Date()

    // The total duration of the timer run in milliseconds
    this.totalDuration = store.get('preferences.notifications.interval') * 60000

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
        switch (this.getState()) {
          case states.RUNNING: // If timer is running, calculate it dynamically
            return this.endDate - new Date()

          case states.IDLE: // If timer is idle, return zeroes
            return 0

          default:
            // Else, just use total duration
            return this.totalDuration
        }
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

        this.reset()

        break

      // End timer and begin break
      case states.IDLE:

        clearTimeout(this.timeout)

        this.emit('timer-end', callback => callback(this.totalDuration))

        break

      // The timer should not be running here
      case states.BLOCKED:
      case states.BLOCKED_AND_STOPPED:
      case states.STOPPED:

        this.totalDuration = store.get('preferences.notifications.interval') * 60000
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
    this.timeout = setTimeout(this.end.bind(this), this.totalDuration)

    // Calculate the end date
    this.endDate = new Date()
    const msLeft = this.endDate.getMilliseconds() + this.totalDuration
    this.endDate.setMilliseconds(msLeft)
  }

  /**
   * Resets the interval for sending timer updates
   */
  resetSendingInterval () {
    this.emit('timer-update', callback => callback(this.getStatus()))

    clearInterval(this.sendingInterval)

    this.sendingInterval = setInterval(() => {
      this.emit('timer-update', callback => callback(this.getStatus()))
    }, 1000)
  }

  /**
   * Resets the timer
   */
  reset () {
    if (this.durationOverride !== null) {
      this.totalDuration = this.durationOverride
      this.durationOverride = null // one-time use
    } else {
      this.totalDuration = store.get('preferences.notifications.interval') * 60000
    }
    this.setup()
  }

  /**
   * Starts the timer
   */
  start () {
    if (this.isBlocked) return
    if (this.getState() === states.RUNNING) return

    // Cancel any scheduled auto-restart since we're starting manually
    this.cancelAutoRestart()

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

    if (store.get('preferences.startup.autoRestartTimer')) {
      // Schedule auto-restart for 6 AM next day
      this.scheduleAutoRestart()
    }

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

  setDurationOverride (milliseconds) {
    this.durationOverride = milliseconds
  }

  /**
   * Pauses the timer if the timer is running,
   * or starts the timer when it is stopped or blocked.
   */
  togglePause () {
    if (this.isStopped) { this.start() } else { this.stop() }
  }

  /**
   * Schedules the timer to automatically restart at 6 AM next day
   */
  scheduleAutoRestart() {
    // Clear any existing auto-restart timeout
    if (this.autoRestartTimeout) {
      clearTimeout(this.autoRestartTimeout)
    }

    // Calculate time until 6 AM next day
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(6, 0, 0, 0) // Set to 6:00:00.000 AM

    const timeUntil6AM = tomorrow.getTime() - now.getTime()

    // Schedule the restart
    this.autoRestartTimeout = setTimeout(() => {
      // Only restart if the timer is still stopped and not blocked
      if (this.isStopped && !this.isBlocked) {
        this.start()
      }
      this.autoRestartTimeout = null
    }, timeUntil6AM)
  }

  /**
   * Cancels the scheduled auto-restart
   */
  cancelAutoRestart() {
    if (this.autoRestartTimeout) {
      clearTimeout(this.autoRestartTimeout)
      this.autoRestartTimeout = null
    }
  }
};

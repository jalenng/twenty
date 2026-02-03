/**
 * @file Handles the timing and logic of the breaks.
 * @author jalenng
 *
 * The states of the break system are as follows:
 *  - isOnBreak
 *      - true <---> false
 *
 * The break system is also an event emitter that emits the following events:
 *  - break-start: when the break begins
 *  - break-times-set: when the break countdown resets (due to user input - mouse or keyboard)
 *  - break-intermediate: when the break reaches an intermediate mark (5 seconds)
 *  - break-end: when the break countdown reaches to zero
 */

require('hazardous') // Needs to be imported before importing 'path'

const path = require('path')

const { powerMonitor, screen } = require('electron')
const soundPlayer = require('sound-play')

const { defaultSoundsPath } = require('../../constants')
const EventEmitter = require('./EventEmitter')
const store = require('../../store/store')

const BREAK_DURATION = 20000
const POPUP_NOTIF_DURATION = 5000

/**
 * Initializes a BreakSystem.
 * @class
 */
module.exports = class BreakSystem extends EventEmitter {
  constructor () {
    super()

    this.isOnBreak = false
    this.totalDuration = 0
    this.endTime = new Date()
  }

  /**
   * Gets the status of the break system
   * @returns an object
   */
  getStatus () {
    const remainingTime = this.isOnBreak ? this.endTime - new Date() : this.totalDuration

    const breakStatus = {
      isOnBreak: this.isOnBreak,
      endTime: this.endTime,
      duration: this.totalDuration,
      remainingTime
    }

    return breakStatus
  }

  /**
   * Starts the break. Calls this.setupTimes in the process.
   */
  start () {
    if (this.isOnBreak) return

    this.isOnBreak = true

    if (store.get('preferences.notifications.enableSound') === true) {
      this.playSound()
    }

    // Emit break-start first so notification windows are created before setupTimes() is called
    this.emit('break-start')

    this.setupTimes()

    // Set interval to continuously check for user input (mouse or keyboard)
    // Using getSystemIdleTime() which resets to 0 on any user activity system-wide
    this.oldMousePos = screen.getCursorScreenPoint()
    this.lastInputResetAt = 0
    this.checkUserInputInterval = setInterval(() => {
      const newMousePos = screen.getCursorScreenPoint()
      const mouseMoved = newMousePos.x !== this.oldMousePos.x || newMousePos.y !== this.oldMousePos.y
      const currentIdleSeconds = powerMonitor.getSystemIdleTime()
      const isActive = currentIdleSeconds === 0
      const now = Date.now()

      // Reset on any activity; throttle to avoid excessive resets while active
      if ((mouseMoved || isActive) && now - this.lastInputResetAt >= 250) {
        this.setupTimes()
        this.lastInputResetAt = now
      }

      this.oldMousePos = newMousePos
    }, 250)
  }

  /**
   * Initializes the end time and timeout
   */
  setupTimes () {
    this.emit('break-times-set')

    this.endTime = new Date()
    this.endTime.setMilliseconds(this.endTime.getMilliseconds() + BREAK_DURATION)

    this.totalDuration = BREAK_DURATION

    clearTimeout(this.mainTimeout)
    clearTimeout(this.intermediateTimeout)

    this.mainTimeout = setTimeout(this.end.bind(this), BREAK_DURATION)
    this.intermediateTimeout = setTimeout(() => {
      // Call break-intermediate listeners after POPUP_NOTIF_DURATION
      this.emit('break-intermediate')
    }, POPUP_NOTIF_DURATION)

    this.resetSendingInterval()
  }

  /**
   * Ends the break and emits the 'break-end' event
   */
  end () {
    if (this.isOnBreak) {
      if (store.get('preferences.notifications.enableSound') === true) {
        this.playSound()
      }

      clearTimeout(this.mainTimeout)
      clearTimeout(this.intermediateTimeout)
      clearInterval(this.checkUserInputInterval)

      this.emit('break-end')

      this.isOnBreak = false
    }
  }

  /**
   * Plays the sound stored in the store under preferences.notifications.sound
   */
  playSound () {
    const soundKey = store.get('preferences.notifications.sound')
    const volume = store.get('preferences.notifications.soundVolume') / 100

    const fullFilepath = path.isAbsolute(soundKey) ? soundKey : path.join(defaultSoundsPath, soundKey)
    soundPlayer.play(fullFilepath, volume)
  }

  /**
   * Resets the interval for sending break countdown updates
   */
  resetSendingInterval () {
    this.emit('break-update', (callback) => callback(this.getStatus()))

    clearInterval(this.sendingInterval)

    this.sendingInterval = setInterval(() => {
      this.emit('break-update', (callback) => callback(this.getStatus()))
    }, 1000)
  }
}

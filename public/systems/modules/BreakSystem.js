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
 *  - break-times-set: when the break countdown resets (due to the user moving their mouse)
 *  - break-intermediate: when the break reaches an intermediate mark (5 seconds)
 *  - break-end: when the break countdown reaches to zero
 */

require('hazardous') // Needs to be imported before importing 'path'

const path = require('path')

const { screen } = require('electron')
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
  };

  /**
   * Gets the status of the break system
   * @returns an object
   */
  getStatus () {
    const remainingTime = this.isOnBreak
      ? this.endTime - new Date()
      : this.totalDuration

    const breakStatus = {
      isOnBreak: this.isOnBreak,
      endTime: this.endTime,
      duration: this.totalDuration,
      remainingTime
    }

    return breakStatus
  };

  /**
   * Starts the break. Calls this.setupTimes in the process.
   */
  start () {
    if (this.isOnBreak) return

    this.isOnBreak = true

    if (store.get('preferences.notifications.enableSound') === true) { this.playSound() }

    this.setupTimes()

    // Set interval to continuously check mouse position
    this.oldMousePos = screen.getCursorScreenPoint()
    this.checkMousePositionInterval = setInterval(() => {
      const newMousePos = screen.getCursorScreenPoint()
      const mouseMoved = newMousePos.x !== this.oldMousePos.x || newMousePos.y !== this.oldMousePos.y

      if (mouseMoved) {
        this.setupTimes()
        this.oldMousePos = newMousePos
      }
    }, 100)

    this.emit('break-start')
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
      if (store.get('preferences.notifications.enableSound') === true) { this.playSound() }

      clearTimeout(this.mainTimeout)
      clearTimeout(this.intermediateTimeout)
      clearInterval(this.checkMousePositionInterval)

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

    const fullFilepath = path.isAbsolute(soundKey)
      ? soundKey
      : path.join(defaultSoundsPath, soundKey)
    soundPlayer.play(fullFilepath, volume)
  }

  /**
   * Resets the interval for sending break countdown updates
   */
  resetSendingInterval () {
    this.emit('break-update', callback => callback(this.getStatus()))

    clearInterval(this.sendingInterval)

    this.sendingInterval = setInterval(() => {
      this.emit('break-update', callback => callback(this.getStatus()))
    }, 1000)
  }
}

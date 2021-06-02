/**
 * @file Handles the opening, closing, and updating of the notification windows during a break.
 * @author jalenng
 */

const { screen } = require('electron')

const createWindow = require('../app/createWindow')

/**
 * Initializes a NotificationSystem.
 * @class
 */
class NotificationSystem {
  constructor () {
    this.fullscreenWindows = []
    this.popupWindows = []
  }

  /**
   * Creates the notification windows
   */
  createWindows () {
    // Get displays and create notification windows
    const displays = screen.getAllDisplays()
    this.fullscreenWindows = displays.map(this.createFullscreenWindow.bind(this))
    this.popupWindows = displays.map(this.createPopupWindow.bind(this))
  }

  /**
   * Closes all the notification windows
   */
  closeWindows () {
    this.fullscreenWindows.map(this.closeNotificationWindow)
    this.popupWindows.map(this.closeNotificationWindow)
    this.fullscreenWindows = []
    this.popupWindows = []
  }

  /**
   * Show the fullscreen windows and hide the popup windows
   */
  maximize () {
    this.fullscreenWindows.map(window => window.show())
    this.popupWindows.map(window => window.hide())
  }

  /**
   * Hide the fullscreen window and show the popup windows
   */
  minimize () {
    try {
      this.fullscreenWindows.map(window => window.hide())
      this.popupWindows.map(window => window.show())
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Creates a fullscreen notification window
   * @param {Display} display - The display to bound the window by
   * @returns {Electron.BrowserWindow}
   */
  createFullscreenWindow (display) {
    return createWindow('notification', 'fullscreenNotification', display, false)
  }

  /**
   * Creates a popup notification window
   * @param {Display} display - The display to bound the window by
   * @returns {Electron.BrowserWindow}
   */
  createPopupWindow (display) {
    return createWindow('notification', 'popupNotification', display, true)
  }

  /**
   * Closes a notification window
   * @param {BrowserWindow} window - The window to close
   */
  closeNotificationWindow (window) {
    window.removeAllListeners('close')
    window.close()
  }
}

/** Exports */
module.exports = NotificationSystem

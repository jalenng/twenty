/**
 * @file Handles the opening, closing, and updating of the notification windows during a break.
 * @author jalenng
 */

const { screen } = require('electron')

const createWindow = require('../../app/createWindow')
const {
  getFullscreenWindows,
  getPopupWindows,
  setFullscreenWindows,
  setPopupWindows
} = require('../../app/windowManager')

/**
 * Initializes a NotificationSystem.
 * @class
 */
class NotificationSystem {
  /**
   * Creates the notification windows
   */
  createWindows () {
    // Get displays and create notification windows
    const displays = screen.getAllDisplays()

    const fullscreenWindows = displays.map(this.createFullscreenWindow.bind(this))
    setFullscreenWindows(fullscreenWindows)

    const popupWindows = displays.map(this.createPopupWindow.bind(this))
    setPopupWindows(popupWindows)
  }

  /**
   * Closes all the notification windows
   */
  closeWindows () {
    getFullscreenWindows().forEach(this.closeNotificationWindow)
    getPopupWindows().forEach(this.closeNotificationWindow)
    this.fullscreenWindows = []
    this.popupWindows = []
  }

  /**
   * Show the fullscreen windows and hide the popup windows
   */
  maximize () {
    getFullscreenWindows().forEach(window => window.show())
    getPopupWindows().forEach(window => window.hide())
  }

  /**
   * Hide the fullscreen window and show the popup windows
   */
  minimize () {
    getFullscreenWindows().forEach(window => window.hide())
    getPopupWindows().forEach(window => window.show())
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

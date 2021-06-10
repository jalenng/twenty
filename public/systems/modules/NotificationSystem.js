/**
 * @file Handles the opening, closing, and updating of the notification windows during a break.
 * @author jalenng
 */

const { screen } = require('electron')

const createWindow = require('../../app/createWindow')
const { fullscreenOverlays, popupOverlays, windowStillExists } = require('../../app/windowManager')

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
    fullscreenOverlays.set(fullscreenWindows)

    const popupWindows = displays.map(this.createPopupWindow.bind(this))
    popupOverlays.set(popupWindows)
  }

  /**
   * Closes all the notification windows
   */
  closeWindows () {
    fullscreenOverlays.get().forEach(this.closeNotificationWindow)
    popupOverlays.get().forEach(this.closeNotificationWindow)
    fullscreenOverlays.set([])
    popupOverlays.set([])
  }

  /**
   * Show the fullscreen windows and hide the popup windows
   */
  maximize () {
    fullscreenOverlays.get().forEach(window => {
      if (windowStillExists(window)) window.show()
    })
    popupOverlays.get().forEach(window => {
      if (windowStillExists(window)) window.hide()
    })
  }

  /**
   * Hide the fullscreen window and show the popup windows
   */
  minimize () {
    fullscreenOverlays.get().forEach(window => {
      if (windowStillExists(window)) window.hide()
    })
    popupOverlays.get().forEach(window => {
      if (windowStillExists(window)) window.show()
    })
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
    if (windowStillExists(window)) {
      window.removeAllListeners('close')
      window.close()
    }
  }
}

/** Exports */
module.exports = NotificationSystem

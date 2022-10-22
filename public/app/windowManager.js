/**
 * @file Holds the references for the application's windows.
 * @author jalenng
 */

let mainWindow
let prefsWindow

let fullscreenOverlays = []
let popupOverlays = []

/**
 * Retrieves all the app's windows
 * @returns {Electron.BrowserWindow[]}
 */
function getAllWindows () {
  return [mainWindow, prefsWindow, ...fullscreenOverlays, ...popupOverlays]
}

/**
 * Checks whether a window is viable for referencing and manipulating
 * @param {Electron.BrowserWindow} window
 * @returns {Boolean} true if the window has not been destroyed and is not null; false otherwise
 */
function windowStillExists (window) {
  return window && !window.isDestroyed()
}

/**
 * Sends an IPC message to all the windows
 * @param {String} channel
 * @param {*} message
 */
function sendToAllWindows (channel, message) {
  const allWindows = getAllWindows()
  for (const window of allWindows) {
    if (windowStillExists(window)) {
      window.webContents.send(channel, message)
    }
  }
}

/** Exports */
module.exports = {

  mainWindow: {
    get: () => mainWindow,
    set: (window) => { mainWindow = window }
  },

  prefsWindow: {
    get: () => prefsWindow,
    set: (window) => { prefsWindow = window }
  },

  fullscreenOverlays: {
    get: () => fullscreenOverlays,
    set: (windows) => { fullscreenOverlays = windows }
  },

  popupOverlays: {
    get: () => popupOverlays,
    set: (windows) => { popupOverlays = windows }
  },

  windowStillExists,
  sendToAllWindows

}

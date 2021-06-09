let mainWindow
let prefsWindow

let fullscreenWindows = []
let popupWindows = []

function getAllWindows () {
  return [mainWindow, prefsWindow, ...fullscreenWindows, ...popupWindows]
}

function sendToAllWindows (channel, message) {
  const allWindows = getAllWindows()
  for (const window of allWindows) {
    if (window && !window.isDestroyed()) {
      window.webContents.send(channel, message)
    }
  }
}

/** Exports */
module.exports = {

  getMainWindow: () => mainWindow,
  getPrefsWindow: () => prefsWindow,

  getFullscreenWindows: () => fullscreenWindows,
  getPopupWindows: () => popupWindows,

  setFullscreenWindows: (windows) => { fullscreenWindows = windows },
  setPopupWindows: (windows) => { popupWindows = windows },

  setMainWindow: (window) => { mainWindow = window },
  setPrefsWindow: (window) => { prefsWindow = window },

  sendToAllWindows: sendToAllWindows

}

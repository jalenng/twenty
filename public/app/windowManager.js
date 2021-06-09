let mainWindow
let prefsWindow

function sendToAllWindows (channel, message) {
  for (const window of [mainWindow, prefsWindow]) {
    if (window && !window.isDestroyed()) {
      window.webContents.send(channel, message)
    }
  }
}

/** Exports */
module.exports = {

  getMainWindow: () => mainWindow,
  getPrefsWindow: () => prefsWindow,

  setMainWindow: (window) => { mainWindow = window },
  setPrefsWindow: (window) => { prefsWindow = window },

  sendToAllWindows: sendToAllWindows

}

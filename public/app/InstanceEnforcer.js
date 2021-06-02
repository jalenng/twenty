/**
 * Mechanism to allow only one instance of the app at once
 */

const { app } = require('electron')

module.exports = class InstanceEnforcer {
  static getLock () {
    // Try to get the lock
    const gotSingleInstanceLock = app.requestSingleInstanceLock()
    if (!gotSingleInstanceLock) app.exit()

    // Show first instance if a second instance is requested
    app.on('second-instance', () => {
      if (global.mainWindow && !global.mainWindow.isDestroyed()) {
        global.mainWindow.show()
      }
    })
  }
}

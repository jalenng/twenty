/**
 * @file Allows only one instance of the app at once
 * @author jalenng
 */

const { app } = require('electron')

// Lock acquisition
const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) app.exit() // Quit the app if another app has the lock

// Show first instance if a second instance is requested
app.on('second-instance', () => {
  if (global.mainWindow && !global.mainWindow.isDestroyed()) {
    global.mainWindow.show()
  }
})

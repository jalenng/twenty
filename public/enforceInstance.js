/**
 * @file Allows only one instance of the app at once
 * @author jalenng
 */

const { app } = require('electron')

const { mainWindow } = require('./app/windowManager')

// Try to acquire the single instance lock
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) { // Quit the app if another app has the lock
  app.exit()
}

// Show first instance if a second instance is requested
app.on('second-instance', () => {
  if (mainWindow.get() && !mainWindow.get().isDestroyed()) {
    mainWindow.get().show()
  }
})

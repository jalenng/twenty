/**
 * @file Allows only one instance of the app at once
 * @author jalenng
 */

const { app } = require('electron')

const { getMainWindow } = require('./app/windowManager')

// Lock acquisition
const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) app.exit() // Quit the app if another app has the lock

// Show first instance if a second instance is requested
app.on('second-instance', () => {
  if (getMainWindow() && !getMainWindow().isDestroyed()) {
    getMainWindow().show()
  }
})

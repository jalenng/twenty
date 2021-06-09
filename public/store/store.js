/**
 * @file Configures and initializes the persistent storage for the application.
 * @author jalenng
 */

const { nativeTheme, app } = require('electron')
const Store = require('electron-store')

const storeSchema = require('./storeSchema')
const { getMainWindow, sendToAllWindows } = require('../app/windowManager')

/** Initialize the store and reset if necessary */

const store = new Store({
  schema: storeSchema,
  watch: true
})

if (store.get('resetFlag')) store.clear() // Reset store if the reset flag is enabled

/** Configure event handlers to handle changes to the store */

// Configure the system's login items when its corresponding preference option changes
store.onDidChange('preferences.startup.startAppOnLogin', (newVal, oldVal) => {
  app.setLoginItemSettings({
    openAtLogin: newVal,
    enabled: newVal,
    path: app.getPath('exe')
  })
})

// Configure the main BrowserWindow's alwaysOnTop property when its corresponding preference option changes
store.onDidChange('preferences.appearance.alwaysOnTop', (newVal, oldVal) => {
  getMainWindow().setAlwaysOnTop(newVal)
})

// Notify the preferences window and main window when any preference changes
store.onDidChange('preferences', () => {
  sendToAllWindows('store-changed', 'preferences')

})

// Notify the preferences and main window when there is an update to the list of sounds
store.onDidChange('sounds', () => {
  sendToAllWindows('store-changed', 'sounds')
})

// Update the Electron nativeTheme's themeSource property when its corresponding preference changes
store.onDidChange('preferences.appearance.theme', (newVal, oldVal) => {
  nativeTheme.themeSource = newVal
})

/** Expose the store object */
module.exports = store

/**
 * @file Configures and initializes the persistent storage for the application.
 * @author jalenng
 */

const { nativeTheme, app } = require('electron')
const Store = require('electron-store')

const storeSchema = require('./storeSchema')

/* ------------------------------------------------------------------------- */
/* Store initialization */

global.store = new Store({
  schema: storeSchema,
  watch: true
})

// Reset entire store if the reset flag is enabled
if (global.store.get('resetFlag')) global.store.clear()

/* ------------------------------------------------------------------------- */
/** Handler for store change events */

// Configure the system's login items when "Start app on login" is changed
global.store.onDidChange('preferences.startup.startAppOnLogin', (newVal, oldVal) => {
  app.setLoginItemSettings({
    openAtLogin: newVal,
    enabled: newVal,
    path: app.getPath('exe')
  })
})

// Configure main window
global.store.onDidChange('preferences.appearance.alwaysOnTop', (newVal, oldVal) => {
  global.mainWindow.setAlwaysOnTop(newVal)
})

// Notify the main window when any section of the store updates
global.store.onDidChange('preferences', () => {
  if (global.mainWindow && !global.mainWindow.isDestroyed()) { global.mainWindow.webContents.send('store-changed', 'preferences') }

  if (global.prefsWindow && !global.prefsWindow.isDestroyed()) { global.prefsWindow.webContents.send('store-changed', 'preferences') }
})

global.store.onDidChange('sounds', () => {
  if (global.mainWindow && !global.mainWindow.isDestroyed()) { global.mainWindow.webContents.send('store-changed', 'sounds') }

  if (global.prefsWindow && !global.prefsWindow.isDestroyed()) { global.prefsWindow.webContents.send('store-changed', 'sounds') }
})

// Update the Electron themeSource property when its preference is changed
global.store.onDidChange('preferences.appearance.theme', (newVal, oldVal) => {
  nativeTheme.themeSource = newVal
})

/**
 * @file Entry point for Electron's main process.
 * @author jalenng
 */

const { BrowserWindow, nativeTheme, app } = require('electron')

const createWindow = require('./createWindow')

// Initialize the stores and systems
require('./store/initializeStore')
require('./systems/initializeSystems')

require('./ipcHandlers')

require('./InstanceEnforcer')

const { appPath, isMacOS } = require('./constants')

/** Configure login item settings */
const startAppOnLogin = global.store.get('preferences.startup.startAppOnLogin')
app.setLoginItemSettings({
  openAtLogin: startAppOnLogin,
  enabled: startAppOnLogin,
  path: appPath
})

/** Application event handlers */
app.whenReady().then(() => {
  // Create main window
  global.mainWindow = createWindow('main')

  // macOS: Recreate a window if none are open but the dock icon is activated
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      global.mainWindow = createWindow('main')
    }
  })

  // Create tray button
  require('./initializeTray')

  // Create menu
  require('./initializeMenu')
})

// Exit the app if all windows are closed if not on macOS
app.on('window-all-closed', function () {
  if (!isMacOS) {
    app.exit()
  }
})

// Prevent loading of new websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
  })
})

/** Theming */

// Update the Electron themeSource property
nativeTheme.themeSource = global.store.get('preferences.appearance.theme')

// Notify WebContents when the theme changes
nativeTheme.on('updated', () => {
  const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  if (global.mainWindow && !global.mainWindow.isDestroyed()) { global.mainWindow.webContents.send('theme-updated', themeName) }

  if (global.prefsWindow && !global.prefsWindow.isDestroyed()) { global.prefsWindow.webContents.send('theme-updated', themeName) }
})

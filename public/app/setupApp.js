/**
 * @file Initializes the Electron app.
 * @author jalenng
 */

const { BrowserWindow, Menu, app } = require('electron')

const { appPath, isDev } = require('../constants')
const { mainWindow } = require('./windowManager')
const createWindow = require('./createWindow')
const store = require('../store/store')
const waitForDevServer = require('./waitForDevServer')

const { createTray } = require('./tray')
const { menu } = require('./menu')
require('./theming')

/** isDev: Do not configure login item settings */
if (!isDev) {
  const startAppOnLogin = store.get('preferences.startup.startAppOnLogin')
  app.setLoginItemSettings({
    openAtLogin: startAppOnLogin,
    enabled: startAppOnLogin,
    path: appPath
  })
}

/** Configure app event handlers */
app.whenReady().then(async () => {
  if (isDev) {
    // Wait for the dev server to be ready
    await waitForDevServer()
  }
  
  mainWindow.set(createWindow('main')) // Create main window

  // macOS: Recreate a window if none are open but the dock icon is activated
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow.set(createWindow('main'))
    }
  })

  createTray() // Create tray button

  Menu.setApplicationMenu(menu) // Create menu
})

// Prevent app from quitting
app.on('will-quit', (event) => { event.preventDefault() })

// Prevent loading of new websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
  })
})

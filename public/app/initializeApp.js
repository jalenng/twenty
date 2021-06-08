const { BrowserWindow, app } = require('electron')

const { appPath, isMacOS, isDev } = require('../constants')
const createWindow = require('./createWindow')
const store = require('../store/store')

require('./ipcHandlers')
require('./theming')

/** Configure login item settings */
if (!isDev) {
  const startAppOnLogin = store.get('preferences.startup.startAppOnLogin')
  app.setLoginItemSettings({
    openAtLogin: startAppOnLogin,
    enabled: startAppOnLogin,
    path: appPath
  })
}

/** Application event handlers */
app.whenReady().then(() => {
  app.setAppUserModelId(process.execPath)

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

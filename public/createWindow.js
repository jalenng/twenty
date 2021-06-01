/**
 * @file Handles the creation of app windows.
 * @author jalenng
 */

const { BrowserWindow, screen, app, Menu } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const { isWindows, appName } = require('./constants')

const windowStateKeeper = require('electron-window-state')

// Shared popup window options
const SHARED_OPTIONS = {
  resizable: false,
  minimizable: false,
  maximizable: false,
  useContentSize: false,
  show: false,
  frame: false,
  transparent: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: false,

    // Allow dev tools (for dev) and remote module (for testing) if isDev
    nodeIntegration: isDev,
    devTools: isDev,
    enableRemoteModule: isDev
  }
}

// Type-specific options
const TYPE_OPTIONS = {
  main: {
    width: 280,
    height: 360,
    title: appName
  },
  preferences: {
    width: 800,
    height: 500,
    title: `${appName} - Preferences`
  },
  notification: {
    alwaysOnTop: true,
    focusable: false,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    title: `${appName} - Notification`
  }
}

const POPUP_OPTIONS = {
  size: {
    width: 360,
    height: 90
  },
  gapFromEdge: 12
}

/**
 * Creates and returns an Electron BrowserWindow
 * @param {*} type  Determines the BrowserWindowOptions.
 *                  Can be "main", "preferences", or "notification".
 * @param {*} destination   The relative address to load
 * @param {*} display   A display object to create the window in relation to. Optional.
 * @param {*} isPopup   True if window is a popup window. False by default.
 *                      Effective only if display is provided. Optional.
 * @returns a BrowserWindow object of the newly created window
 */
module.exports = function createWindow (type, destination = '', display = null, isPopup = false) {
  // Initialize window
  const window = new BrowserWindow({
    ...SHARED_OPTIONS,
    ...TYPE_OPTIONS[type]
  })

  // Load URL
  window.loadURL(
    isDev
      ? `http://localhost:3000#/${destination}`
      : `file://${path.join(__dirname, `../build/index.html#${destination}`)}`
  )

  let mainWindowState

  switch (type) {
    case 'main':
      // Window state keeper for main window
      mainWindowState = windowStateKeeper({})

      // Update and remember the position of the main window
      if (mainWindowState.x && mainWindowState.y) {
        window.setPosition(mainWindowState.x, mainWindowState.y)
      }
      mainWindowState.manage(window)

      // Make the main window always on top if its corresponding preference is enabled
      window.setAlwaysOnTop(global.store.get('preferences.appearance.alwaysOnTop'))

      // Update the alwaysOnTop preference when the main window's alwaysOnTop property changes
      window.on('always-on-top-changed', (event, isAlwaysOnTop) => {
        global.store.set('preferences.appearance.alwaysOnTop', isAlwaysOnTop)
      })

      // Handle the close button action
      window.on('close', (e) => {
        if (isDev) {
          app.exit() // Just exit the app if isDev
        } else {
          e.preventDefault() // Otherwise, just hide to tray
          global.mainWindow.hide()
        }
      })

      // If not configured to hide the app on app startup, show window when ready
      if (!global.store.get('preferences.startup.hideOnAppStartup')) { window.on('ready-to-show', () => window.show()) }

      break

    case 'notification':
      // Prevent closing
      window.on('close', (e) => e.preventDefault())

      // If notification is a popup window, show when ready
      if (isPopup) { window.on('ready-to-show', () => window.show()) }

      break

    case 'preferences':
      // Show window when ready
      window.on('ready-to-show', () => window.show())

      break
  }

  // If displays are provided for setting bounds
  if (display) {
    let windowBounds

    if (!isPopup) { // If fullscreen intended
      windowBounds = display.bounds
    } else { // Else, popup intended
      const bounds = display.workArea

      const popupSize = POPUP_OPTIONS.size
      const popupGapFromEdge = POPUP_OPTIONS.gapFromEdge

      if (isWindows) {
        // Perform additional processing on Windows due to DPI differences
        const screenRect = isWindows ? screen.dipToScreenRect(null, bounds) : bounds
        const trueScaling = display.scaleFactor / screen.getPrimaryDisplay().scaleFactor

        windowBounds = {
          x: screenRect.x + ((bounds.width - popupSize.width - popupGapFromEdge) * trueScaling),
          y: screenRect.y + ((bounds.height - popupSize.height - popupGapFromEdge) * trueScaling),
          width: popupSize.width,
          height: popupSize.height
        }
      } else {
        windowBounds = {
          x: bounds.x + bounds.width - popupSize.width,
          y: bounds.y + bounds.height - popupSize.height,
          width: popupSize.width,
          height: popupSize.height
        }
      }
    }

    // Set bounds
    window.setBounds(windowBounds)
  }

  window.on('system-context-menu', (event, point) => {
    event.preventDefault()
    Menu.buildFromTemplate([
      { role: 'close' }
    ]).popup()
  })

  // On macOS, make it visible across all workspaces
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // Prevent opening new windows
  window.webContents.setWindowOpenHandler('new-window', () => { return ({ action: 'deny' }) })

  return window
}

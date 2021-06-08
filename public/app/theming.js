const { nativeTheme } = require('electron')

/** Theming */

// Update the Electron themeSource property
nativeTheme.themeSource = global.store.get('preferences.appearance.theme')

// Notify WebContents when the theme changes
nativeTheme.on('updated', () => {
  const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  if (global.mainWindow && !global.mainWindow.isDestroyed()) {
    global.mainWindow.webContents.send('theme-updated', themeName)
  }

  if (global.prefsWindow && !global.prefsWindow.isDestroyed()) {
    global.prefsWindow.webContents.send('theme-updated', themeName)
  }
})

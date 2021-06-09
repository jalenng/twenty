const { nativeTheme } = require('electron')

const store = require('../store/store')
const { getMainWindow, getPrefsWindow } = require('./windowManager')

/** Theming */

// Update the Electron themeSource property
nativeTheme.themeSource = store.get('preferences.appearance.theme')

// Notify WebContents when the theme changes
nativeTheme.on('updated', () => {
  const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  if (getMainWindow() && !getMainWindow().isDestroyed()) {
    getMainWindow().webContents.send('theme-updated', themeName)
  }

  if (getPrefsWindow() && !getPrefsWindow().isDestroyed()) {
    getPrefsWindow().webContents.send('theme-updated', themeName)
  }
})

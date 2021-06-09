const { nativeTheme } = require('electron')

const store = require('../store/store')
const { sendToAllWindows } = require('./windowManager')

// Update the Electron themeSource property
nativeTheme.themeSource = store.get('preferences.appearance.theme')

// Notify WebContents when the theme changes
nativeTheme.on('updated', () => {
  const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  sendToAllWindows('theme-updated', themeName)
})

/**
 * @file Contains all the main process's IPC handlers.
 * @author jalenng
 */

const { BrowserWindow, ipcMain, app, nativeTheme } = require('electron')

const { isDev } = require('../constants')
const createWindow = require('./createWindow')
const { getPrefsWindow, setPrefsWindow } = require('./windowManager')

/* ------------------------------------------------------------------------- */
/* Main */

// Find out whether or not the app is running in a dev environment
ipcMain.on('is-dev', (event) => {
  event.returnValue = isDev
})

// Log to main process's console
ipcMain.handle('log-to-main', (event, content) => {
  console.log(content.toString())
})

// Open preferences
ipcMain.handle('open-preferences', () => {
  if (!getPrefsWindow() || getPrefsWindow().isDestroyed()) {
    setPrefsWindow(createWindow('preferences', 'preferences'))
  } else {
    getPrefsWindow().restore()
    getPrefsWindow().focus()
  }
})

// Restart the app
ipcMain.handle('restart-app', () => {
  app.relaunch()
  app.exit()
})

// Get info about the app
ipcMain.on('get-about-info', (event) => {
  event.returnValue = {
    appInfo: {
      name: app.getName(),
      version: app.getVersion()
    },
    versions: process.versions,
    links: [
      { name: 'GitHub', link: 'https://github.com/jalenng/twenty', iconName: 'GitGraph' },
      { name: 'Website', link: 'https://jalenng.github.io/twenty', iconName: 'Globe' }
    ],
    openSourceLibraries: [
      { name: '@fluentui/react', link: 'https://github.com/microsoft/fluentui' },
      { name: 'electron', link: 'https://github.com/electron/electron' },
      { name: 'electron-is-dev', link: 'https://github.com/sindresorhus/electron-is-dev' },
      { name: 'electron-store', link: 'https://github.com/sindresorhus/electron-store' },
      { name: 'electron-window-state', link: 'https://github.com/mawie81/electron-window-state' },
      { name: 'hazardous', link: 'https://github.com/epsitec-sa/hazardous' },
      { name: 'react', link: 'https://github.com/facebook/react' },
      { name: 'react-circle', link: 'https://github.com/zzarcon/react-circle' },
      { name: 'sound-play', link: 'https://github.com/ilehoang/sound-play' },
      { name: 'standard', link: 'https://github.com/standard/standard' }
    ],
    license: [
      {
        number: 1,
        text:
        'MIT License'
      },
      {
        number: 2,
        text:
        'Copyright © 2021 Jalen Ng'
      },
      {
        number: 3,
        text:
        `Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:`
      },
      {
        number: 4,
        text:
        `The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.`
      },
      {
        number: 5,
        text:
        `THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.`
      }
    ]
  }
})

// Get the name of the current platform. https://nodejs.org/api/process.html#process_process_platform
ipcMain.on('get-platform', (event) => {
  event.returnValue = process.platform
})

// Get the name of the current theme
ipcMain.on('get-theme-name', (event) => {
  event.returnValue = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
})

// Toggle the pin status of a window
ipcMain.handle('toggle-pin-window', (event) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender)
  senderWindow.setAlwaysOnTop(!senderWindow.isAlwaysOnTop())
  return (senderWindow.isAlwaysOnTop())
})

// Toggle the pin status of a window
ipcMain.handle('set-fullscreen', (event, status) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender)
  senderWindow.setFullScreen(status)
})

// Toggle the movable status of a window
ipcMain.handle('set-movable', (event, status) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender)
  senderWindow.setMovable(status)
})

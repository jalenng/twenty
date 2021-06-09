/**
 * @file Holds the template for the app menu.
 * @author jalenng
 *
 *  - File
 *    * Preferences (Ctrl+,)
 *    * Close (Alt+F4)
 *  - Timer
 *    * Start/Stop (Ctrl+S)
 *  - Dev
 *    * Reload (Ctrl+R)
 *    * Force Reload (Ctrl+Shift+R)
 *    * Toggle Developer Tools (Ctrl+Shift+I)
 *    * Start break (Ctrl+E)
 *  - Help (F1)
 *    * About
 */

const { Menu } = require('electron')

const { timerSystem } = require('../systems/systems')
const createWindow = require('./createWindow')
const { prefsWindow } = require('./windowManager')

const { isDev } = require('../constants')

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          if (!prefsWindow.get() || prefsWindow.get().isDestroyed()) {
            prefsWindow.set(createWindow('preferences', 'preferences'))
          } else {
            prefsWindow.get().restore()
            prefsWindow.get().focus()
          }
        }
      },
      { type: 'separator' },
      { role: 'close' }
    ]
  },
  {
    label: 'Timer',
    submenu: [
      {
        label: 'Start/Stop',
        accelerator: 'CmdOrCtrl+s',
        click: () => { timerSystem.togglePause() }
      }
    ]
  },
  ...(isDev
    ? [{
        label: 'Dev',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          {
            label: 'Test break',
            accelerator: 'CmdOrCtrl+e',
            click: () => { timerSystem.end() }
          }
        ]
      }]
    : []),
  {
    role: 'help',
    submenu: [
      {
        label: 'About',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
])

module.exports = { menu }

/**
 * @file Contains IPC handlers related to the persistent storage.
 * @author jalenng
 */

const path = require('path')

const { ipcMain, app, dialog } = require('electron')

const store = require('../store/store')
const { prefsWindow } = require('../app/windowManager')

// Show a dialog to import a custom sound
ipcMain.handle('add-custom-sound', (event) => {
  dialog.showOpenDialog(prefsWindow.get(), {
    title: 'Choose custom sound',
    filters: [{
      name: 'Audio files',
      extensions: ['wav', 'mp3']
    }],
    defaultPath: app.getPath('music'),
    properties: ['openFile', 'dontAddToRecent']
  })
    .then(result => {
      // If user did not cancel the dialog
      if (!result.canceled) {
        const filePath = result.filePaths[0]

        // Create new sound object from selected file
        const newSound = {
          key: filePath,
          text: path.basename(filePath)
        }
        let newCustomSounds = store.get('sounds.customSounds')

        // Concatenate with existing list of custom sounds
        newCustomSounds = newCustomSounds.concat(newSound)

        // Update custom sounds with updated array
        store.set('sounds.customSounds', newCustomSounds)

        // Set new sound as default notification sound
        store.set('preferences.notifications.sound', filePath)
      }
    }).catch(err => {
      console.log(err)
    })
})

// Retrieve from the local store
ipcMain.on('get-store', (event, key) => { event.returnValue = store.get(key) })

// Show a dialog to confirm resetting the app
ipcMain.handle('reset-store', () => {
  store.set('resetFlag', true)
  app.relaunch()
  app.exit()
})

// Update a value in the store
ipcMain.handle('set-store', (event, key, value) => {
  store.set(key, value)
})

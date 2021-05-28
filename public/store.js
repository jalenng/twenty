const { ipcMain, dialog, nativeTheme, app } = require('electron');
const Store = require('electron-store');
const path = require('path');

const storeSchema = require('./storeSchema');

/* Create the store */
const storeOptions = {
    schema: storeSchema,
    watch: true
}
global.store = new Store(storeOptions);

// store.clear()

// Reset entire store if the reset flag is enabled
if (store.get('resetFlag')) store.clear();

/*---------------------------------------------------------------------------*/

/**
 * Handler for store change events
 */

// Configure the system's login items when "Start app on login" is changed
store.onDidChange('preferences.startup.startAppOnLogin', (newVal, oldVal) => {
    app.setLoginItemSettings({
        openAtLogin: newVal,
        enabled: newVal,
        path: app.getPath('exe')
    })
});

// Configure main window
store.onDidChange('preferences.appearance.alwaysOnTop', (newVal, oldVal) => {
    global.mainWindow.setAlwaysOnTop(newVal);
});

// Notify the main window when any section of the store updates
store.onDidChange('preferences', () => {
    if (global.mainWindow && !global.mainWindow.isDestroyed())
        global.mainWindow.webContents.send('store-changed', 'preferences');
    
    if (global.prefsWindow && !global.prefsWindow.isDestroyed())
        global.prefsWindow.webContents.send('store-changed', 'preferences');
});

store.onDidChange('sounds', () => {
    if (global.mainWindow && !global.mainWindow.isDestroyed())
        global.mainWindow.webContents.send('store-changed', 'sounds');
        
    if (global.prefsWindow && !global.prefsWindow.isDestroyed())
        global.prefsWindow.webContents.send('store-changed', 'sounds');
});

// Update the Electron themeSource property when its preference is changed
store.onDidChange('preferences.appearance.theme', (newVal, oldVal) => {
    nativeTheme.themeSource = newVal;
});

/*---------------------------------------------------------------------------*/
/* IPC event handlers */

// Retrieve from the local store
ipcMain.on('get-store', (event, key) => event.returnValue = store.get(key));

// Update the local preferences
ipcMain.handle('set-prefs', (event, key, value) => {
    store.set(`preferences.${key}`, value);
});

// Show a dialog to import a custom sound
ipcMain.handle('add-custom-sound', (event) => {
    dialog.showOpenDialog(global.mainWindow, {
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
                var filePath = result.filePaths[0];

                // Create new sound object from selected file
                var newSound = {
                    key: filePath,
                    text: path.basename(filePath)
                }
                var newCustomSounds = store.get('sounds.customSounds');

                // Concatenate with existing list of custom sounds
                newCustomSounds = newCustomSounds.concat(newSound);

                // Update custom sounds with updated array
                store.set('sounds.customSounds', newCustomSounds);

                // Set new sound as default notification sound
                store.set('preferences.notifications.sound', filePath);

            }
        }).catch(err => {
            console.log(err);
        })
});

// Show a dialog to confirm resetting the app
ipcMain.handle('reset-store', () => {
    dialog.showMessageBox(global.mainWindow, {
        title: 'Reset iCare',
        type: 'question',
        message: 'Reset iCare?',
        detail: 'iCare will restart, and your preferences will revert to its defaults.',
        buttons: ['Yes', 'No'],
    })
        .then(result => {
            if (result.response == 0) {
                store.set('resetFlag', true);
                app.relaunch();
                app.exit();
            }
        })
})
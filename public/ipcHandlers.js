const { ipcMain, app, nativeTheme } = require('electron');
const isDev = require('electron-is-dev');

const { createWindow } = require('./createWindows');

/*---------------------------------------------------------------------------*/
/* Main */

// Find out whether or not the app is running in a dev environment
ipcMain.on('is-dev', (event) => {
    event.returnValue = isDev;
})

// Log to main process's console
ipcMain.handle('log-to-main', (event, content) => {
    console.log(content.toString());
})

// Open preferences
ipcMain.handle('open-preferences', () => {
    if (!global.prefsWindow || global.prefsWindow.isDestroyed())
        global.prefsWindow = createWindow('preferences', 'prefs');
    else {
        global.prefsWindow.restore();
        global.prefsWindow.focus();
    }
})

// Restart the app
ipcMain.handle('restart-app', () => {
    app.relaunch();
    app.exit();
})

// Get info about the app
ipcMain.on('get-about-info', (event) => {
    event.returnValue = {
        appInfo: {
            name: app.getName(),
            version: app.getVersion()
        },
        versions: process.versions,
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
        ],
        license: [
            `MIT License`,
            `Copyright © 2021 Jalen Ng`,
            `Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:`,
            `The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.`,
            `THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.`
        ]
    };
})

// Get the name of the current platform. https://nodejs.org/api/process.html#process_process_platform
ipcMain.on('get-platform', (event) => {
    event.returnValue = process.platform;
})

// Get the name of the current theme
ipcMain.on('get-theme-name', (event) => {
    event.returnValue = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
})


/*---------------------------------------------------------------------------*/
/* Store-related */

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

// Retrieve from the local store
ipcMain.on('get-store', (event, key) => event.returnValue = store.get(key));

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

// Update the local preferences
ipcMain.handle('set-prefs', (event, key, value) => {
    store.set(`preferences.${key}`, value);
});

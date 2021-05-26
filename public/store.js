const { ipcMain, dialog, app } = require('electron');
const Store = require('electron-store');
const path = require('path');
const axios = require('axios');

const storeSchema = require('./storeSchema');

/* Create the store */
const storeOptions = {
    schema: storeSchema,
    watch: true
}
global.store = new Store(storeOptions);
store.reset('messages'); // Clear all in-app messages on app startup

// Reset entire store if the reset flag is enabled
if (store.get('resetFlag')) store.clear();

// store.clear();
// store.set('preferences.notifications.interval', 0.2)
// console.log(store.store)

/* Configure axios */
axios.defaults.baseURL = 'http://165.232.156.120:3000';
axios.defaults.timeout = 10000;
axios.defaults.headers.common['auth'] = store.get('accounts.token');

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

// Notify the main window when any section of the store updates
store.onDidChange('preferences', () => {
    global.mainWindow.webContents.send('store-changed', 'preferences');
});
store.onDidChange('sounds', () => {
    global.mainWindow.webContents.send('store-changed', 'sounds');
});
store.onDidChange('accounts', () => {
    // Configure axios to make requests with the token
    axios.defaults.headers.common['auth'] = store.get('accounts.token');
    global.mainWindow.webContents.send('store-changed', 'accounts');
});
store.onDidChange('insights', () => {
    global.mainWindow.webContents.send('store-changed', 'insights');
});
store.onDidChange('messages', () => {
    global.mainWindow.webContents.send('store-changed', 'messages');
});


/*---------------------------------------------------------------------------*/
/* IPC event handlers */

// Retrieve from the local store
ipcMain.on('get-store', (event, key) => event.returnValue = store.get(key));

// Update the local preferences
ipcMain.handle('set-prefs', (event, key, value) => {
    store.set(`preferences.${key}`, value);
});

// Fetch user preferences from the backend
// GET - /prefs
ipcMain.handle('fetch-prefs', async () => {
    const successCallback = (res) => {
        store.set('preferences.notifications', res.data.notifications);
        store.set('preferences.dataUsage', res.data.dataUsage);
    }
    return await returnAxiosResult('get', 'prefs', {}, [200], successCallback);
})

// Update user preferences on the backend
// PUT - /prefs
ipcMain.handle('push-prefs', async (event) => {
    const data = {
        notifications: store.get('preferences.notifications'),
        dataUsage: store.get('preferences.dataUsage')
    };
    return await returnAxiosResult('put', 'prefs', data, [200]);
})

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

// Authenticate the user and retrieve a token (by signing in or signing up)
// If signing in: POST - /auth
// If signing up: POST - /user
ipcMain.handle('authenticate', async (event, email, password, createAccount = false, displayName = '') => {
    let location;
    let data;

    if (createAccount) { // Sign up
        location = 'user';
        data = {
            email: email,
            password: password,
            displayName: displayName
        }
    }
    else {  // Sign in
        location = 'auth';
        data = {
            email: email,
            password: password
        }
    }

    const successCallback = (res) => {
        const accounts = {
            token: res.data.token,
            accountInfo: {
                email: res.data.accountInfo.email,
                displayName: res.data.accountInfo.displayName
            }
        };
        store.set('accounts', accounts);
    }

    return await returnAxiosResult('post', location, data, [200, 201], successCallback);
})

// Fetch the latest account information from the backend
// GET - /user
ipcMain.handle('fetch-account-info', async (event) => {
    const successCallback = (res) => {
        const accountInfo = {
            email: res.data.email,
            displayName: res.data.displayName
        }
        store.set('accounts.accountInfo', accountInfo);
    }
    return await returnAxiosResult('get', 'user', {}, [200], successCallback);
})

// Update accounts information on the backend
// PUT - /user
ipcMain.handle('update-account-info', async (event, email, displayName, password) => {
    const data = {
        email: email,
        displayName: displayName,
        password: password,
    };
    const successCallback = (res) => {
        let accountInfo = {
            email: res.data.email,
            displayName: res.data.displayName
        }
        store.set('accounts.accountInfo', accountInfo)
    }

    return await returnAxiosResult('put', 'user', data, [202], successCallback);
})

// Clear the accounts store (by signing out or deleting the account)
// If deleting: DELETE - /user
ipcMain.handle('sign-out', async (event, deleteAccount = false, password = '') => {
    const data = {
        password: password,
    }
    let result;

    if (deleteAccount)
        result = await returnAxiosResult('delete', 'user', data, [200]);

    if (!deleteAccount || result.success) {
        store.reset('accounts');
        store.reset('insights');
        store.reset('dataUsage');
    }

    return result;
})

// Fetch data usage
ipcMain.handle('fetch-data-usage', async () => {
    const successCallback = (res) => store.set('dataUsage.fetched', res.data);
    return await returnAxiosResult('get', 'data', {}, [200], successCallback);
})

// Update data usage on the backend, and reset local data usage
// PUT - /data
ipcMain.handle('push-data-usage', async () => {
    const successCallback = () => {
        // Clear unsynced data
        store.set('dataUsage.unsynced.timerUsage', []);
        store.set('dataUsage.unsynced.appUsage', []);
    }

    const data = {
        timerUsage: store.get('dataUsage.unsynced.timerUsage'),
        appUsage: store.get('dataUsage.unsynced.appUsage')
    }
    return await returnAxiosResult('put', 'data', data, [200], successCallback);
})

// Fetch insights from the backend
// GET - /data/insights
ipcMain.handle('fetch-insights', async () => {
    const successCallback = (res) => store.set('insights.cards', res.data.cards);
    return await returnAxiosResult('get', 'data/insights', {}, [200], successCallback);
})

// Retrieve the list of in-app messages
ipcMain.on('get-messages', (event) => {
    event.returnValue = store.get('messages');
});

// Add an in-app message
ipcMain.handle('add-message', (event, message) => {
    let messages = store.get('messages');
    messages = [...messages, message];
    store.set('messages', messages);
})

// Dismiss an in-app message
ipcMain.handle('dismiss-message', (event, index) => {
    let messages = store.get('messages');
    messages.splice(index, 1);
    store.set('messages', messages);
})

// Show a dialog to confirm resetting the app
ipcMain.handle('reset-store', () => {
    dialog.showMessageBox(global.mainWindow, {
        title: 'Reset iCare',
        type: 'question',
        message: 'Are you sure you want to reset iCare?',
        detail: 'You will be signed out, and all unsynced data will be lost.',
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


/*---------------------------------------------------------------------------*/

/**
 * Helper function to make a call with axios
 * @param {String} request  The request type. Can be one of {'get', 'delete', 'head', 'options', 'post', 'put', 'patch'}
 * @param {String} location The relative URL to make the request to
 * @param {Object} data     The data to send with the request
 * @param {Number[]} successStatuses    An array of status codes to be accepted for success
 * @param {(axios.response) => any} successCallback    A callback function that is executed when the request is successful
 * @returns 
 */
async function returnAxiosResult(request, location, data, successStatuses, successCallback = () => { }) {
    try {
        let res = request === 'get'
            ? await axios.get(location, { data })
            : request === 'delete'
                ? await axios.delete(location, { data })
                : request === 'head'
                    ? await axios.head(location, { data })
                    : request === 'options'
                        ? await axios.options(location, { data })
                        : request === 'post'
                            ? await axios.post(location, data)
                            : request === 'put'
                                ? await axios.put(location, data)
                                : request === 'patch'
                                    ? await axios.patch(location, data)
                                    : console.log(`Invalid request type: ${request}`);

        // If axios call was successful
        if (successStatuses.indexOf(res.status) != -1) {
            successCallback(res);
            return {
                success: true,
                data: {}
            }
        }
    }
    catch (error) {
        console.log(error)
        // If backend returned a reason and message for the error
        let responseMessageExists =
            error.response
            && error.response.data
            && error.response.data.reason
            && error.response.data.message;

        if (responseMessageExists) {
            return {
                success: false,
                data: {
                    reason: error.response.data.reason,
                    message: error.response.data.message
                }
            }
        }
        else {      // Return generic error
            return {
                success: false,
                data: {
                    reason: 'RESPONSE_ERR',
                    message: error.toString()
                }
            }
        }
    }
}
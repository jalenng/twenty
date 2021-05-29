const { ipcMain, dialog, nativeTheme, app } = require('electron');
const Store = require('electron-store');
const path = require('path');
const fs = require('fs');

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
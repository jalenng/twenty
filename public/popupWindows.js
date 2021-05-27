const { BrowserWindow, ipcMain } = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path'); 

let popupWindow;

// Shared popup window options
const sharedWindowOptions = {
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false,

        // Allow dev tools (for dev) and remote module (for testing) if isDev
        nodeIntegration: isDev,
        devTools: isDev,
        enableRemoteModule: isDev
    }
}

function openPopup(customOptions, destination) {
    
    popupWindow = new BrowserWindow({
        ...sharedWindowOptions,
        ...customOptions
    })
    popupWindow.loadURL( 
        isDev
        ? `http://localhost:3000#/${destination}`
        : `file://${path.join(__dirname, `../build/index.html#${destination}`)}`
    ); 
    
    if (!isDev) popupWindow.removeMenu();
    
    popupWindow.on('ready-to-show', () => popupWindow.show());

    return popupWindow;
}


/*---------------------------------------------------------------------------*/
/* IPC event handlers */

// Timer popup
ipcMain.handle('open-preferences', event => {
    global.prefsWindow = openPopup({
        width: 800,
        height: 500,
        title: 'Preferences'
    }, 'prefs');
})
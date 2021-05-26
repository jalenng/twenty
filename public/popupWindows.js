const { BrowserWindow, ipcMain } = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path'); 

let popupWindow;

// Shared popup window options
const sharedWindowOptions = {
    width: 380,
    resizable: false,
    minimizable: false,
    maximizable: false,
    backgroundColor: '#222222',
    show: false,
    modal: true,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false
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
    
    popupWindow.removeMenu();
    popupWindow.on('ready-to-show', () => popupWindow.show());
}


/*---------------------------------------------------------------------------*/
/* IPC event handlers */

// Sign-in popup
ipcMain.handle('show-sign-in-popup', event => {
    openPopup({
        height: 420,
        title: 'Sign in',
        parent: global.mainWindow
    }, 'signin');
})


// Delete account popup
ipcMain.handle('show-delete-account-popup', event => {
    openPopup({
        height: 240,
        title: 'Delete account',
        parent: global.mainWindow
    }, 'deleteAccount');
})


// Edit account popup
ipcMain.handle('show-edit-account-popup', event => {
    openPopup({
        height: 420,
        title: 'Edit account',
        parent: global.mainWindow
    }, 'editAccount');
})


// Timer popup
ipcMain.handle('show-timer-popup', event => {
    openPopup({
        width: 320,
        height: 400,
        title: 'iCare',
        alwaysOnTop: true,
        modal: false,
        parent: global.mainWindow
    }, 'popupTimer');
})
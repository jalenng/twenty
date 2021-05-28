const {
    BrowserWindow,
    Tray,
    Menu,
    nativeImage,
    nativeTheme,
    app,
    ipcMain,
} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const { createWindow } = require('./createWindows');

// Initialize the stores and systems
require('./store');
require('./initializeSystems');

global.mainWindow;
global.prefsWindow;


/*---------------------------------------------------------------------------*/
/* Mechanism to allow only one instance of the app at once */

// Try to get the lock
const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) app.exit()

// Show first instance if a second instance is requested
app.on('second-instance', () => {
    if (global.mainWindow && !global.mainWindow.isDestroyed()) {
        global.mainWindow.restore()
        global.mainWindow.focus()
    }
})


/*---------------------------------------------------------------------------*/
/* Configure login item settings */

app.setLoginItemSettings({
    openAtLogin: global.store.get('preferences.startup.startAppOnLogin'),
    enabled: global.store.get('preferences.startup.startAppOnLogin'),
    path: app.getPath('exe')
})


/*---------------------------------------------------------------------------*/
/* Application event handlers */
let appTray = null;

app.whenReady().then(() => {

    global.mainWindow = createWindow('main');

    // Pin main window if option is enabled
    global.mainWindow.setAlwaysOnTop(store.get('preferences.appearance.alwaysOnTop'));

    /* When app is activated and no windows are open, create a window */
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    /* Create tray button */
    const trayIcon = nativeImage.createFromPath(path.join(__dirname, '../trayAssets/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'iCare', enabled: false },
        { type: 'separator' },
        { label: 'Quit', click: app.exit }
    ]);

    appTray = new Tray(trayIcon);
    appTray.setToolTip('iCare');
    appTray.setContextMenu(contextMenu);
    appTray.on('click', () => {
        global.mainWindow.show();
        global.mainWindow.focus();
    });

})

/* Handle closing all windows behavior for macOS */
app.on('window-all-closed', function () {
    if (process.platform === 'darwin') app.exit();
})

/* Prevent loading of new websites */
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault()
    })
})


/*---------------------------------------------------------------------------*/
/* Theming */

// Update the Electron themeSource property
nativeTheme.themeSource = store.get('preferences.appearance.theme');

// Notify WebContents when the theme changes
nativeTheme.on('updated', () => {
    const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

    if (global.mainWindow && !global.mainWindow.isDestroyed()) 
        global.mainWindow.webContents.send('theme-updated', themeName);

    if (global.prefsWindow && !global.prefsWindow.isDestroyed()) 
        global.prefsWindow.webContents.send('theme-updated', themeName);
})


/*---------------------------------------------------------------------------*/
/* IPC event handlers */

// Log to main process's console
ipcMain.handle('log-to-main', (event, content) => {
    console.log(content.toString());
})

// Restart the app
ipcMain.handle('restart-app', () => {
    app.relaunch();
    app.exit();
})

// Find out whether or not the app is running in a dev environment
ipcMain.on('is-dev', (event) => {
    event.returnValue = isDev;
})

// Get the name of the current platform. https://nodejs.org/api/process.html#process_process_platform
ipcMain.on('get-platform', (event) => {
    event.returnValue = process.platform;
})

// Get the name of the current theme
ipcMain.on('get-theme-name', (event) => {
    event.returnValue = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
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
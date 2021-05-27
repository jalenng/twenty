const {
    BrowserWindow,
    Tray,
    Menu,
    nativeImage,
    app,
    ipcMain,
    globalShortcut
} = require('electron');
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev');
const path = require('path');

// Initialize the stores, systems, and popup window functions
require('./store');
require('./initializeSystems');
require('./popupWindows');

const DEFAULT_WINDOW_SIZE = {
    defaultWidth: 860,
    defaultHeight: 550,
}

global.mainWindow;
global.prefsWindow;

let mainWindowState;

/**
 * Function to create the main window
 */
function createWindow() {

    mainWindowState = windowStateKeeper(DEFAULT_WINDOW_SIZE);

    // Instantiate the window
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: 280,
        height: 360,
        maximizable: false,
        resizable: false,
        title: 'iCare',
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
        },
    });

    // Manage the size of the main window
    mainWindowState.manage(mainWindow);

    // Remove the menu and load the page
    if (!isDev) mainWindow.removeMenu()
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // Prevent opening new windows
    mainWindow.webContents.on('new-window', (e, url) => e.preventDefault())

    // Handle the close button action
    mainWindow.on('close', (e) => {
        if (isDev)
            app.exit(); // Just exit the app if isDev
        else {
            e.preventDefault(); // Otherwise, just hide to tray
            mainWindow.hide();
        }
    })

    // Open the window when it is ready to be shown
    mainWindow.on('ready-to-show', () => mainWindow.show());

}

/*---------------------------------------------------------------------------*/
/* Mechanism to allow only one instance of the app at once */

const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) app.exit()

// Show first instance if a second instance is requested
app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
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

    createWindow()

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
        mainWindow.show();
        mainWindow.focus();
    });

})

/* Handle closing all windows behavior for macOS */
app.on('window-all-closed', function () {
    if (process.platform === 'darwin') app.exit()
})

/* Prevent loading of new websites */
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault()
    })
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

// Get info about the app
ipcMain.on('get-about-info', (event) => {
    let aboutInfo = {
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
            `Copyright (c) 2021 Team Paladins`,
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
    }
    event.returnValue = aboutInfo;
})
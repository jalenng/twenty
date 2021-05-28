const { BrowserWindow, screen, app } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const isWindows = process.platform == 'win32';

const windowStateKeeper = require('electron-window-state');

// Shared popup window options
const SHARED_OPTIONS = {
    resizable: false,
    minimizable: false,
    maximizable: false,
    useContentSize: true,
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

// Type-specific options
const TYPE_OPTIONS = {
    main: {
        width: 280,
        height: 360,
        title: 'iCare',
    },
    preferences: {
        width: 800,
        height: 500,
        title: 'iCare - Preferences'
    },
    notification: {
        alwaysOnTop: true,
        focusable: false,
        resizable: false,
        movable: false,
        skipTaskbar: true,
        title: 'iCare - Notification',
    }
}

const POPUP_OPTIONS = {
    size: {
        width: 360,
        height: 90
    },
    gapFromEdge: 12
}

/**
 * Creates and returns an Electron BrowserWindow
 * @param {*} type  Determines the BrowserWindowOptions. 
 *                  Can be "main", "preferences", or "notification".
 * @param {*} destination   The relative address to load
 * @param {*} display   A display object to create the window in relation to. Optional.
 * @param {*} isPopup   True if window is a popup window. False by default. 
 *                      Effective only if display is provided. Optional.
 * @returns a BrowserWindow object of the newly created window
 */
function createWindow(type, destination = '', display=null, isPopup=false) {

    // Initialize window
    let window = new BrowserWindow({
        ...SHARED_OPTIONS,
        ...TYPE_OPTIONS[type]
    })

    // Load URL
    window.loadURL(
        isDev
            ? `http://localhost:3000#/${destination}`
            : `file://${path.join(__dirname, `../build/index.html#${destination}`)}`
    );

    switch (type) {
        case 'main':
            // Window state keeper for main window
            const mainWindowState = windowStateKeeper({});

            // Update and remember the position of the main window
            window.setPosition(mainWindowState.x, mainWindowState.y);
            mainWindowState.manage(window);

            // Handle the close button action
            window.on('close', (e) => {
                if (isDev)
                    app.exit(); // Just exit the app if isDev
                else {
                    e.preventDefault(); // Otherwise, just hide to tray
                    mainWindow.hide();
                }
            })

            // If not configured to hide the app on app startup, show window when ready
            if (!global.store.get('preferences.startup.hideOnAppStartup')) 
                window.on('ready-to-show', () => window.show());

            break;

        case 'notification':
            // Prevent closing
            window.on('close', (e) => e.preventDefault())

            // If notification is a popup window, show when ready
            if (isPopup)
                window.on('ready-to-show', () => window.show());

            break;

        case 'preferences':
            // Show window when ready
            window.on('ready-to-show', () => window.show());

            break;
    }

    // If displays are provided for setting bounds
    if (display) {

        let windowBounds;

        // If displays provided were intended for displaying fullscreen
        if (!isPopup) {
            windowBounds = display.bounds;
        }

        // Else, displays were provided for displaying a popup
        else {
            const bounds = display.workArea;

            const popupSize = POPUP_OPTIONS.size;
            const popupGapFromEdge = POPUP_OPTIONS.gapFromEdge;
    
            if (isWindows) {

                // Perform additional processing on Windows due to DPI differences
                const screenRect = isWindows ? screen.dipToScreenRect(null, bounds) : bounds;
                const trueScaling = display.scaleFactor / screen.getPrimaryDisplay().scaleFactor;
                
                windowBounds = {
                    x: screenRect.x + ((bounds.width - popupSize.width - popupGapFromEdge) * trueScaling),
                    y: screenRect.y + ((bounds.height - popupSize.height - popupGapFromEdge) * trueScaling),
                    width: popupSize.width,
                    height: popupSize.height
                }

            }
            else {

                windowBounds = {
                    x: bounds.x + bounds.width - POPUP_SIZE.width,
                    y: bounds.y + bounds.height - POPUP_SIZE.height,
                    width: POPUP_SIZE.width,
                    height: POPUP_SIZE.height
                }

            }
        }

        // Set bounds
        window.setBounds(windowBounds); 

    }

    // Remove default menu and shortcut bindings
    // if (!isDev) window.removeMenu();
    
    // On macOS, make it visible across all workspaces
    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    // Prevent opening new windows
    window.webContents.setWindowOpenHandler('new-window', () => { return ({ action: 'deny' }) });

    return window;
}

module.exports = {
    createWindow: createWindow
}
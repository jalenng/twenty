/*
The notification system handles the opening, closing, and updating of the 
notification windows during a break. 
*/

const { BrowserWindow, screen } = require('electron');
const path = require('path'); 
const isDev = require('electron-is-dev'); 
const isWindows = process.platform == 'win32';

// Shared notification window options
const sharedWindowOptions = {
    alwaysOnTop: true,
    focusable: false,
    resizable: false,
    movable: false,
    frame: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    show: false,
    title: 'iCare Notification',
    backgroundColor: '#222222',
    webPreferences: {
        preload: path.join(__dirname, '../preload.js'),
        contextIsolation: false
    }
};

const POPUP_SIZE = {
    width: 360,
    height: 90
}

module.exports = function() {

    this.fullscreenWindows = [];
    this.popupWindows = [];

    /**
     * Creates notification windows
     */
    this.createWindows = function() {
        // Get displays and create notification windows
        const displays = screen.getAllDisplays();
        this.fullscreenWindows = displays.map(this.createFullscreenWindow.bind(this));
        this.popupWindows = displays.map(this.createPopupWindow.bind(this));    
    }

    /**
     * Closes all the notification windows
     */
    this.closeWindows = function() {
        this.fullscreenWindows.map(this.closeNotificationWindow);
        this.popupWindows.map(this.closeNotificationWindow);
        this.fullscreenWindows = [];
        this.popupWindows = [];
    }

    /**
     * Show the fullscreen and hide the popup notification windows
     */
    this.maximize = function() {
        this.fullscreenWindows.map(window => window.show());
        this.popupWindows.map(window => window.hide());
    }

    /**
     * Hide the fullscreen and show the popup notification windows
     */
    this.minimize = function() {
        try {
            this.fullscreenWindows.map(window => window.hide());
            this.popupWindows.map(window => window.show());
        }
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Pushes a fullscreen notification window
     * @param {Display} display the display to bound the window to
     */
    this.createFullscreenWindow = function(display) {

        const window = new BrowserWindow({
            ...sharedWindowOptions
        })

        // Load URL
        window.loadURL(
            isDev
            ? 'http://localhost:3000#/fullscreenNotification'
            : `file://${path.join(__dirname, '../../build/index.html#fullscreenNotification')}`
        ); 

        // Configure bounds and visibility
        const bounds = display.bounds;
        const screenRect = isWindows ? screen.dipToScreenRect(null, bounds) : bounds;
        const newBounds = {
            ...screenRect,
            width: bounds.width,
            height: bounds.height
        }
        window.setBounds(bounds);
        window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })   
        window.removeMenu()

        // Configure event listeners
        window.on('close', (e) => e.preventDefault())

        return window;

    }

    /**
     * Pushes a popup notification window
     * @param {Display} display the display to bound the window to
     */
    this.createPopupWindow = function(display) {

        const window = new BrowserWindow({
            ...sharedWindowOptions
        })

        // Load URL
        window.loadURL(
            isDev
            ? 'http://localhost:3000#/popupNotification'
            : `file://${path.join(__dirname, '../../build/index.html#popupNotification')}`
        ); 

        // Configure bounds and visibility
        const bounds = display.workArea;
        let newBounds;

        if (isWindows) {
            const screenRect = isWindows ? screen.dipToScreenRect(null, bounds) : bounds;
            const trueScaling = display.scaleFactor / screen.getPrimaryDisplay().scaleFactor;
            newBounds = {
                x: screenRect.x + ((bounds.width - POPUP_SIZE.width) * trueScaling),
                y: screenRect.y + ((bounds.height - POPUP_SIZE.height) * trueScaling),
                width: POPUP_SIZE.width,
                height: POPUP_SIZE.height
            }
        }
        else {
            newBounds = {
                x: bounds.x + bounds.width - POPUP_SIZE.width,
                y: bounds.y + bounds.height - POPUP_SIZE.height,
                width: POPUP_SIZE.width,
                height: POPUP_SIZE.height
            }
        }

        window.setBounds(newBounds); 
        window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
        window.removeMenu()

        // Configure event listeners
        window.on('close', (e) => e.preventDefault())
        window.on('ready-to-show', () => window.show());

        return window;

    }

    /**
     * Closes a notification window
     * @param {BrowserWindow} window 
     */
    this.closeNotificationWindow = function(window) {
        window.removeAllListeners('close');
        window.close();
    }

}
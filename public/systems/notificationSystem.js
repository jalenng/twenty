/*
The notification system handles the opening, closing, and updating of the 
notification windows during a break. 
*/

const { BrowserWindow, screen } = require('electron');
const { createWindow } = require('../createWindows');

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

        return createWindow('notification', 'fullscreenNotification', display, false)

    }

    /**
     * Pushes a popup notification window
     * @param {Display} display the display to bound the window to
     */
    this.createPopupWindow = function(display) {

        return createWindow('notification', 'popupNotification', display, true, )

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
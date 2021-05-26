/*
The purpose of this preload script is to provide a set of methods for the 
renderer (React code) to interact with the main process (Electron). 
 
This compartmentalization ensures that logic is handled exclusively by Electron,
and displaying UI elements is handled exclusively by React.
*/

// Allow access to core Electron APIs when testing
if (process.env.NODE_ENV === 'test') 
    window.electronRequire = require;

const { ipcRenderer } = require('electron');


/*---------------------------------------------------------------------------*/
/* Event system */

const EventSystem = function () {

    this._events = {}
    /**
     * Register an event listener
     * @param {string} name 
     * @param {} listener 
     */
    this.on = (name, listener) => {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        this._events[name].push(listener);
    }
}


/*---------------------------------------------------------------------------*/
/* Store helper functions */

window.store = {
    preferences: {
        /**
         * Retrieve the local preferences
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-store', 'preferences') },

        /**
         * Update the local preferences
         * @param {String} key The key of the preference. e.g. 'notifications.sound'
         * @param {String} value The new value 
         */
        set: (key, value) => { ipcRenderer.invoke('set-prefs', key, value) },

        /**
         * Fetch user preferences from the backend
         */
        fetch: () => { return ipcRenderer.invoke('fetch-prefs') },

        /**
         * Update user preferences on the backend
         */
        push: () => { return ipcRenderer.invoke('push-prefs') },

        /* Event system */
        eventSystem: new EventSystem()
    },
    accounts: {
        /**
         * Retrieve the local accounts
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-store', 'accounts') },

        /**
         * Authenticate the user with an existing account
         * @param {String} email the email address of the account
         * @param {String} password the password of the account
         * @returns {Object} the response of the sign-in attempt
         */
        signIn: (email, password) => { return ipcRenderer.invoke('authenticate', email, password) },

        /**
         * Create an account and authenticate the user with it
         * @param {String} email the email address of the new account
         * @param {String} password the password of the new account
         * @param {String} displayName the display name of the new account
         * @returns {Object} the response of the sign-up attempt
         */
        signUp: (email, password, displayName) => {
            return ipcRenderer.invoke('authenticate', email, password, true, displayName)
        },

        /**
         * Sign out of the logged-in account
         */
        signOut: () => { return ipcRenderer.invoke('sign-out', false) },

        /**
         * Delete the logged-in account and sign out
         * @param {String} password The existing password for confirmation
         */
        delete: (password) => { return ipcRenderer.invoke('sign-out', true, password) },

        /**
         * Fetch the latest account information from the backend
         */
        fetchInfo: () => { return ipcRenderer.invoke('fetch-account-info') },

        /**
         * Update accounts information on the backend
         * @param {String} email The new email
         * @param {String} displayName The new displayname
         * @param {String} password The existing password for confirmation
         */
        updateInfo: (email, displayName, password) => {
            return ipcRenderer.invoke('update-account-info', email, displayName, password)
        },

        /* Event system */
        eventSystem: new EventSystem()
    },
    sounds: {
        /**
         * Retrieve the local sounds
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-store', 'sounds') },

        /**
         * Show a dialog to import a custom sound
         */
        add: () => { ipcRenderer.invoke('add-custom-sound') },

        /* Event system */
        eventSystem: new EventSystem()
    },
    dataUsage: {
        /**
         * Retrieve the local data usage
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-store', 'dataUsage') },

        /**
         * Fetch data usage from the backend
         */
        fetch: () => { return ipcRenderer.invoke('fetch-data-usage') },

        /**
         * Update data usage on the backend
         */
        push: () => { return ipcRenderer.invoke('push-data-usage') },

        /* Event system */
        eventSystem: new EventSystem()
    },
    insights: {
        /**
         * Retrieve the local insights
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-store', 'insights') },

        /**
         * Fetch insights from the backend
         * @returns {Object}
         */
        fetch: () => { return ipcRenderer.invoke('fetch-insights') },

        /* Event system */
        eventSystem: new EventSystem()
    },
    appNames: {
        /**
         * Retrieve the dictionary of friendly app names
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-store', 'appNames') },
    },
    messages: {
        /**
         * Retrieve the list of in-app messages
         * @returns {Object}
         */
        getAll: () => { return ipcRenderer.sendSync('get-messages') },

        /**
         * Add an in-app message
         */
        add: (message) => { ipcRenderer.invoke('add-message', message) },

        /**
         * Dismiss an in-app message
         */
        dismiss: (index) => { ipcRenderer.invoke('dismiss-message', index) },
        
        /* Event system */
        eventSystem: new EventSystem()
    },
    reset: () => { return ipcRenderer.invoke('reset-store') }
}


/*---------------------------------------------------------------------------*/
/* Popup window helper functions */
window.showPopup = {
    /**
     * Open the "Sign in" popup window
     */
    signIn: () => { ipcRenderer.invoke('show-sign-in-popup') },

    /**
     * Open the "Delete account" popup window
     */
    deleteAccount: () => { ipcRenderer.invoke('show-delete-account-popup') },

    /**
     * Open the "Edit account" popup window
     */
    editAccount: () => { ipcRenderer.invoke('show-edit-account-popup') },

    /**
     * Open the popup timer window
     */
    timer: () => { ipcRenderer.invoke('show-timer-popup') }
}


/*---------------------------------------------------------------------------*/
/* Timer, break, and blocker system helper functions */
window.timer = {
    toggle: () => { ipcRenderer.invoke('timer-toggle') },
    end: () => { ipcRenderer.invoke('timer-end') },
    reset: () => { ipcRenderer.invoke('timer-reset') },
    getStatus: () => { ipcRenderer.send('get-timer-status') },
    eventSystem: new EventSystem()
}

window.breakSys = {
    getStatus: () => { ipcRenderer.send('get-break-status') },
    eventSystem: new EventSystem()
}

window.blockerSys = {
    getBlockers: () => {ipcRenderer.send('get-blockers')},
    clear: () => { ipcRenderer.invoke('clear-blockers') },
    eventSystem: new EventSystem()
}


/*---------------------------------------------------------------------------*/
/* Other functions */

/**
 * Play the selected notification sound in preferences
 */
window.playSound = () => { ipcRenderer.invoke('play-sound') }

/**
 * Retrieves information about the app
 * @returns an object with the relevant information
 */
window.getAboutInfo = () => { return ipcRenderer.sendSync('get-about-info') }

/**
 * Get a list of open windows on the system
 */
window.getOpenWindows = () => { return ipcRenderer.sendSync('get-open-windows') }

/**
 * Prints content on the main process's console
 */
window.logToMain = (content) => { ipcRenderer.invoke('log-to-main', content) }

/**
 * Relaunches the iCare application
 */
window.restartApp = () => { ipcRenderer.invoke('restart-app') }

/**
 * A boolean that tells whether or not this app is running in a dev environment
 */
window.isDev = ipcRenderer.sendSync('is-dev');

/**
 * A string that indicates the current platform the app is running on
 */
window.platform = ipcRenderer.sendSync('get-platform');

/**
 * Get the current date
 */
window.getToday = () => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = ("00" + (now.getMonth() + 1)).substr(-2, 2);
    const nowDate = ("00" + now.getDate()).substr(-2, 2);
    return (`${nowYear}-${nowMonth}-${nowDate}`);
}


/* Listen for events from ipcRenderer and relay them accordingly */
ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
    const fireCallbacks = (callback) => callback(event, timerStatus);
    window.timer.eventSystem._events['update'].forEach(fireCallbacks);
})

ipcRenderer.on('receive-break-status', (event, breakStatus) => {
    const fireCallbacks = (callback) => callback(event, breakStatus);
    window.breakSys.eventSystem._events['update'].forEach(fireCallbacks);
})

ipcRenderer.on('store-changed', (event, category) => {
    const fireCallbacks = (callback) => callback();
    window.store[category].eventSystem._events['changed'].forEach(fireCallbacks);
})

ipcRenderer.on('receive-blockers', (event, blockers) => {
    const fireCallbacks = (callback) => callback(event, blockers);
    window.blockerSys.eventSystem._events['update'].forEach(fireCallbacks);
})
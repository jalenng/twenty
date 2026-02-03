/**
 * @file Provides a set of methods for the renderer to interact with the main process.
 * @author jalenng
 *
 * This compartmentalization ensures that logic is handled exclusively by Electron,
 * and displaying UI elements is handled exclusively by React.
 */

// Allow access to core Electron APIs when testing
if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require
}

const { ipcRenderer, shell } = require('electron')

/* ------------------------------------------------------------------------- */
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
      this._events[name] = []
    }
    this._events[name].push(listener)
  }
}

/* ------------------------------------------------------------------------- */
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
    set: (key, value) => { ipcRenderer.invoke('set-store', `preferences.${key}`, value) },

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
  appNames: {
    /**
     * Retrieve the dictionary of friendly app names
     * @returns {Object}
     */
    getAll: () => { return ipcRenderer.sendSync('get-store', 'appNames') }
  },
  tutorialFlag: {
    /**
     * Retrieve the tutorial flag
     * @returns {boolean} true if the tutorial has been completed; false otherwise
     */
    get: () => { return ipcRenderer.sendSync('get-store', 'tutorialFlag') },

    /**
     * Sets the tutorial flag
     * @returns {boolean} true if the tutorial has been completed; false otherwise
     */
    set: (value) => { ipcRenderer.invoke('set-store', 'tutorialFlag', value) }
  },
  /**
   * Requests a store reset
   */
  reset: () => { ipcRenderer.invoke('reset-store') }
}

/* ------------------------------------------------------------------------- */
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

window.cancelBreak = () => ipcRenderer.invoke('cancel-break')
window.delayBreak = (minutes) => ipcRenderer.invoke('delay-break', minutes)
window.triggerBreak = () => ipcRenderer.invoke('trigger-break')

window.blockerSys = {
  getBlockers: () => { ipcRenderer.send('get-blockers') },
  clear: () => { ipcRenderer.invoke('clear-blockers') },
  eventSystem: new EventSystem()
}

window.themeSys = {
  eventSystem: new EventSystem()
}

/* ------------------------------------------------------------------------- */
/* Other functions */

/**
 * Open the preferences window
 */
window.openPrefs = () => { ipcRenderer.invoke('open-preferences') }

/**
 * Play the selected notification sound in preferences
 */
window.playSound = () => { ipcRenderer.invoke('play-sound') }

/**
 * Get a list of open windows on the system
 */
window.getOpenWindows = () => { return ipcRenderer.sendSync('get-open-windows') }

/**
 * Prints content on the main process's console
 */
window.logToMain = (content) => { ipcRenderer.invoke('log-to-main', content) }

/**
 * Relaunches the application
 */
window.restartApp = () => { ipcRenderer.invoke('restart-app') }

/**
 * Opens a link in an external browser
 */
window.openExternalLink = link => { shell.openExternal(link) }

/**
 * Gets the name of the current theme to be used
 */
window.getThemeName = () => { return ipcRenderer.sendSync('get-theme-name') }

/**
 * Toggles the pin status of the window
 */
window.togglePin = () => { return ipcRenderer.invoke('toggle-pin-window') }

/**
 * Toggles the pin status of the window
 */
window.setFullscreen = (status) => { ipcRenderer.invoke('set-fullscreen', status) }

/**
 * Toggles the movable status of the window
 */
window.setMovable = (status) => { ipcRenderer.invoke('set-movable', status) }

/**
 * Checks for updates
 */
window.checkUpdate = () => { return ipcRenderer.invoke('check-update') }

/**
 * Downloads update
 */
window.downloadUpdate = () => { return ipcRenderer.invoke('download-update') }

/**
 * Information about the app
 */
window.aboutAppInfo = ipcRenderer.sendSync('get-about-info')

/**
 * A boolean that tells whether or not this app is running in a dev environment
 */
window.isDev = ipcRenderer.sendSync('is-dev')

/**
 * A string that indicates the current platform the app is running on
 */
window.platform = ipcRenderer.sendSync('get-platform')

/* Listen for events from ipcRenderer and relay them accordingly */
ipcRenderer.on('receive-timer-status', (event, timerStatus) => {
  const callbacks = window.timer.eventSystem._events.update
  if (callbacks) callbacks.forEach(callback => callback(event, timerStatus))
})

ipcRenderer.on('receive-break-status', (event, breakStatus) => {
  const callbacks = window.breakSys.eventSystem._events.update
  if (callbacks) callbacks.forEach(callback => callback(event, breakStatus))
})

ipcRenderer.on('store-changed', (event, category) => {
  const callbacks = window.store[category].eventSystem._events.changed
  if (callbacks) callbacks.forEach(callback => callback())
})

ipcRenderer.on('receive-blockers', (event, blockers) => {
  const callbacks = window.blockerSys.eventSystem._events.update
  if (callbacks) callbacks.forEach(callback => callback(event, blockers))
})

ipcRenderer.on('theme-updated', (event, themeName) => {
  const callbacks = window.themeSys.eventSystem._events.update
  if (callbacks) callbacks.forEach(callback => callback(themeName))
})

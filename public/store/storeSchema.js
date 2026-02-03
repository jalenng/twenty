/**
 * @file Holds the schema that defines and validates the structure of the app's persistent storage.
 * @author jalenng
 */

/* Preferences
    - notifications
      * enableSound (boolean)
      * interval (number)
      * sound (string)
      * snoozeSeconds (number)
    - blockers
      * apps (array of strings)
      * blockOnBattery (boolean)
    - startup
      * startAppOnLogin (boolean)
      * startTimerOnAppStartup (boolean)
      * hideOnAppStartup (boolean)
      * autoRestartTimer (boolean)
    - appearance
      * theme (string)
      * alwaysOnTop (boolean)
*/
const preferencesSchema = {
  type: 'object',

  default: {
    notifications: {
      enableSound: true,
      interval: 20,
      sound: 'Long Expected.mp3',
      soundVolume: 100,
      snoozeSeconds: 120
    },
    blockers: {
      apps: [],
      blockOnBattery: false
    },
    startup: {
      startAppOnLogin: true,
      startTimerOnAppStartup: true,
      hideOnAppStartup: false,
      autoRestartTimer: true
    },
    appearance: {
      theme: 'system',
      alwaysOnTop: false
    }
  },

  properties: {
    notifications: {
      type: 'object',
      properties: {
        enableSound: {
          type: 'boolean'
        },
        interval: {
          type: 'number',
          minimum: 5,
          maximum: 60
        },
        sound: {
          type: 'string'
        },
        soundVolume: {
          type: 'number',
          minimum: 0,
          maximum: 100
        },
        snoozeSeconds: {
          type: 'number',
          minimum: 10,
          maximum: 300
        }
      },
      additionalProperties: false
    },

    blockers: {
      type: 'object',
      properties: {
        apps: {
          type: 'array',
          items: { type: 'string' }
        },
        blockOnBattery: { type: 'boolean' }
      },
      additionalProperties: false
    },

    startup: {
      type: 'object',
      properties: {
        startAppOnLogin: { type: 'boolean' },
        startTimerOnAppStartup: { type: 'boolean' },
        hideOnAppStartup: { type: 'boolean' },
        autoRestartTimer: { type: 'boolean' }
      },
      additionalProperties: false
    },

    appearance: {
      type: 'object',
      properties: {
        theme: { type: 'string' },
        alwaysOnTop: { type: 'boolean' }
      },
      additionalProperties: false
    }

  },
  additionalProperties: false
}

/* Sounds
    - defaultSounds (array of objects, each with properties 'key' and 'text')
    - customSounds (array of objects, each with properties 'key' and 'text')
*/
const soundsSchema = {
  type: 'object',

  default: {
    defaultSounds: [],
    customSounds: []
  },

  properties: {
    defaultSounds: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          text: { type: 'string' }
        },
        additionalProperties: false
      }
    },
    customSounds: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          text: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
}

/* App names
   (Key-value set where the keys are paths to executables and the values are the friendly names)
*/
const appNamesSchema = {
  type: 'object',
  default: {},
  additionalProperties: { type: 'string' }
}

/* Reset flag (boolean) */
const resetFlagSchema = {
  type: 'boolean',
  default: false
}

/* Tutorial flag (boolean) */
const tutorialFlagSchema = {
  type: 'boolean',
  default: false
}

/* Export the schema */
module.exports = {
  preferences: preferencesSchema,
  sounds: soundsSchema,
  appNames: appNamesSchema,
  resetFlag: resetFlagSchema,
  tutorialFlag: tutorialFlagSchema
}

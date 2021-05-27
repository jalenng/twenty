/*
This schema configures and validates the app's persistent storage.
*/

/* 
Preferences 
    - notifications
        * enableSound (boolean)
        * interval (number)
        * sound (string)
    - blockers
        * apps (array of strings)
        * blockOnBattery (boolean)
    - startup
        * startAppOnLogin (boolean)
        * startTimerOnAppStartup (boolean)
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
            sound: '../../sounds/Long Expected.mp3',
            soundVolume: 100
        },
        blockers: {
            apps: [],
            blockOnBattery: true
        },
        startup: {
            startAppOnLogin: true,
            startTimerOnAppStartup: true
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
                enableSound:  {
                    type: 'boolean',
                },
                interval: {
                    type: 'number',
                    minimum: 5,
                    maximum: 60
                },
                sound:  {
                    type: 'string',
                },
                soundVolume: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100
                },
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
                startTimerOnAppStartup: { type: 'boolean' }
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

/* 
Sounds 
    - defaultSounds (array of objects, each with properties 'key' and 'text')
    - customSounds (array of objects, each with properties 'key' and 'text')
*/
const soundsSchema = {
    type: 'object',

    default: {
        defaultSounds: [
            {
                key: '../../sounds/Clearly.mp3',
                text: 'Clearly'
            },
            {
                key: '../../sounds/Done For You.mp3',
                text: 'Done For You'
            },
            {
                key: '../../sounds/Insight.mp3',
                text: 'Insight'
            },
            {
                key: '../../sounds/Juntos.mp3',
                text: 'Juntos'
            },
            {
                key: '../../sounds/Long Expected.mp3',
                text: 'Long Expected'
            },
            {
                key: '../../sounds/Nostalgia.mp3',
                text: 'Nostalgia'
            },
            {
                key: '../../sounds/Pristine.mp3',
                text: 'Pristine'
            },
            {
                key: '../../sounds/When.mp3',
                text: 'When'
            },
        ],
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

/* 
App names (key-value set where the keys are paths to executables and the values are the friendly names)
*/
const appNamesSchema = {
    type: 'object',
    default: {},
    additionalProperties: { type: 'string' }
}

/* 
Reset flag (boolean)
*/
const resetFlagSchema = {
    type: 'boolean',
    default: false
}

/* Exports */
module.exports = {
    preferences: preferencesSchema,
    sounds: soundsSchema,
    appNames: appNamesSchema,
    resetFlag: resetFlagSchema
}
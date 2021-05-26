const preferencesSchema = {
    type: 'object',

    default: {
        notifications: {
            enableSound: true,
            interval: 20,
            sound: '../../sounds/Long Expected.mp3',
            soundVolume: 100
        },
        dataUsage: {
            trackAppUsageStats: true,
            enableWeeklyUsageStats: true
        },
        blockers: {
            apps: [],
            blockOnBattery: true
        },
        startup: {
            startAppOnLogin: true,
            startTimerOnAppStartup: true
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

        dataUsage: {
            type: 'object',
            properties: {
                trackAppUsageStats: { type: 'boolean' },
                enableWeeklyUsageStats: { type: 'boolean' },
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
        }

    },
    additionalProperties: false
}

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

const accountsSchema = {
    type: 'object',

    default: {
        token: null,
        accountInfo: {
            email: 'Features are limited. Please sign in.',
            displayName: 'iCare Guest'
        }
    },

    properties: {
        token: { type: ['null', 'string'] },
        accountInfo: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                displayName: { type: 'string' }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
}

const dataUsageSchema = {
    type: 'object',

    default: {
        unsynced: {
            appUsage: [],
            timerUsage: []
        },
        fetched: {
            appUsage: [],
            timerUsage: []
        }
    },

    properties: {
        unsynced: {
            type: 'object',
            properties: {
                appUsage: { type: 'array' },
                timerUsage: { type: 'array' }
            }
        },
        fetched: {
            type: 'object',
            properties: {
                appUsage: { type: 'array' },
                timerUsage: { type: 'array' }
            }
        }
    }
}

const insightsSchema = {
    type: 'object',

    default: {
        cards: []
    },

    properties: {
        cards: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    header: { type: 'string'},
                    content: { type: 'string'}
                },
                additionalProperties: false
            }
        }
    },
    additionalProperties: false
}

const appNamesSchema = {
    type: 'object',
    default: {},
    additionalProperties: { type: 'string' }
}

const messagesSchema = {
    type: 'array',
    default: [],
    items: {
        type: 'object',
        properties: {
            type: { type: 'number' },
            contents: { type: 'string' }
        },
        additionalProperties: false
    }
}

const resetFlagSchema = {
    type: 'boolean',
    default: false
}

module.exports = {
    preferences: preferencesSchema,
    sounds: soundsSchema,
    accounts: accountsSchema,
    dataUsage: dataUsageSchema,
    insights: insightsSchema,
    appNames: appNamesSchema,
    messages: messagesSchema,
    resetFlag: resetFlagSchema
}
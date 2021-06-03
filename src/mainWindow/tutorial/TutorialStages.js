/* eslint-disable no-undef */

const appName = aboutAppInfo.appInfo.name

module.exports = [
  {
    direction: 'topCenter',
    props: {
      headline: `Welcome to ${appName}.`,
      target: '#container'
    },
    contents: 'For a quick overview, click ‘Next’.'
  },

  {

    direction: 'leftCenter',
    props: {
      target: '#container',
      headline: 'The 20-20-20 rule'
    },
    contents: 'Looking at screens for long periods of time strains our eyes. The 20-20-20 rule suggests that for every 20 minutes, look at something at least 20 feet away for 20 seconds. '
  },

  {
    direction: 'leftCenter',
    props: {
      headline: 'Timer',
      target: '#timer'
    },
    contents: 'This timer keeps track of the 20-minute intervals for you. When the timer ends, you will be reminded and the timer will be restarted automatically. '
  },

  {

    direction: 'bottomRightEdge',
    props: {
      headline: 'Start/stop button',
      target: '#toggleBtn'
    },
    contents: 'Start and stop the timer here. When the timer is stopped, you will not receive notifications. '
  },

  {
    direction: 'bottomLeftEdge',
    props: {
      headline: 'Preferences button',
      target: '#prefsBtn'
    },
    contents: 'Customize your notifications, blockers, and more here. '
  },

  {
    direction: 'rightCenter',
    props: {
      headline: 'Close button',
      target: '#closeBtn'
    },
    contents: `Hides the timer window to the tray. ${appName} will run in the background. You can quit ${appName} from the system tray.`
  },

  {
    props: {
      headline: 'You\'re all set!',
      target: '#container'
    },
    direction: 'rightCenter'
  }
]

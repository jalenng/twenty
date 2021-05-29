/**
 * @file Initializes the various systems that manage the app logic, as well as
 * their interactions with each other.
 * @author jalenng
 */

const { powerMonitor } = require('electron')

const TimerSystem = require('./timerSystem')
const BreakSystem = require('./breakSystem')
const NotificationSystem = require('./notificationSystem')
const AppSnapshotSystem = require('./appSnapshotSystem')
const BlockerSystem = require('./blockerSystem')

global.timerSystem = new TimerSystem()
global.breakSystem = new BreakSystem()
global.notificationSystem = new NotificationSystem()
global.appSnapshotSystem = new AppSnapshotSystem()
global.blockerSystem = new BlockerSystem()

/* ------------------------------------------------------------------------- */
/* Start timer automatically based on user preferences */

if (global.store.get('preferences.startup.startTimerOnAppStartup')) { global.timerSystem.start() }

global.appSnapshotSystem.updateState()

/* ------------------------------------------------------------------------- */
/* If timer has stopped and the notification interval updates, update the timer with the new value. */

global.store.onDidChange('preferences.notifications.interval', () => {
  if (global.timerSystem.isStopped) global.timerSystem.update()
})

/* ------------------------------------------------------------------------- */
/* Configure event listeners and connect the various systems */

// Start break when timer ends
global.timerSystem.on('timer-end', () => global.breakSystem.start())

// Create notification windows when break starts
global.breakSystem.on('break-start', () => global.notificationSystem.createWindows())

// Minimize notification when the break time is set/reset
global.breakSystem.on('break-times-set', () => global.notificationSystem.minimize())

// Expand notification when the break time is past the intermediate point
global.breakSystem.on('break-intermediate', () => global.notificationSystem.maximize())

// Close notification windows when break ends
global.breakSystem.on('break-end', () => global.notificationSystem.closeWindows())

// Start timer when break ends
global.breakSystem.on('break-end', () => global.timerSystem.start())

// Process the list of open apps through the blocker system when a snapshot is taken
global.appSnapshotSystem.on('app-snapshot-taken', (snapshot) => global.blockerSystem.processAppSnapshot(snapshot))

// Block the timer when a blocker is detected
global.blockerSystem.on('blocker-detected', () => global.timerSystem.block())

// Unblock the timer when all blockers are cleared
global.blockerSystem.on('blockers-cleared', () => global.timerSystem.unblock())

/* ------------------------------------------------------------------------- */
/* Update blockers when the power state updates */

// If on battery when the app is open, add a blocker

if (powerMonitor.isOnBatteryPower()) {
  if (global.store.get('preferences.blockers.blockOnBattery')) {
    global.blockerSystem.add({
      type: 'other',
      key: 'batteryPower',
      message: 'Your computer is running on battery power.'
    })
  }
}

// Add a blocker if switched to battery power
powerMonitor.on('on-battery', () => {
  if (global.store.get('preferences.blockers.blockOnBattery')) {
    global.blockerSystem.add({
      type: 'other',
      key: 'batteryPower',
      message: 'Your computer is running on battery power.'
    })
  }
})

// Remove the blocker if switched to AC power
powerMonitor.on('on-ac', () => {
  if (global.store.get('preferences.blockers.blockOnBattery')) {
    global.blockerSystem.remove('other', 'batteryPower')
  }
})

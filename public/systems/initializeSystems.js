/**
 * @file Initializes the various systems that manage the app logic, as well as
 * their interactions with each other.
 * @author jalenng
 */

const { powerMonitor } = require('electron')

const TimerSystem = require('./TimerSystem')
const BreakSystem = require('./BreakSystem')
const NotificationSystem = require('./NotificationSystem')
const AppSnapshotSystem = require('./AppSnapshotSystem')
const BlockerSystem = require('./BlockerSystem')

require('./ipcHandlers')

global.systems = {
  timer: new TimerSystem(),
  break: new BreakSystem(),
  notification: new NotificationSystem(),
  appSnapshot: new AppSnapshotSystem(),
  blocker: new BlockerSystem()
}

/* ------------------------------------------------------------------------- */
/* If timer has stopped and the notification interval updates, update the timer with the new value. */

global.store.onDidChange('preferences.notifications.interval', () => {
  if (global.systems.timer.isStopped) global.systems.timer.update()
})

/* ------------------------------------------------------------------------- */
/* Configure event listeners and connect the various systems */

// Start break when timer ends
global.systems.timer.on('timer-end', () => global.systems.break.start())

// Create notification windows when break starts
global.systems.break.on('break-start', () => global.systems.notification.createWindows())

// Minimize notification when the break time is set/reset
global.systems.break.on('break-times-set', () => global.systems.notification.minimize())

// Expand notification when the break time is past the intermediate point
global.systems.break.on('break-intermediate', () => global.systems.notification.maximize())

// Close notification windows when break ends
global.systems.break.on('break-end', () => global.systems.notification.closeWindows())

// Start timer when break ends
global.systems.break.on('break-end', () => global.systems.timer.start())

// Process the list of open apps through the blocker system when a snapshot is taken
global.systems.appSnapshot.on('app-snapshot-taken', (snapshot) => {
  global.systems.blocker.processAppSnapshot(snapshot)
})

// Block the timer when a blocker is detected
global.systems.blocker.on('blocker-detected', () => global.systems.timer.block())

// Unblock the timer when all blockers are cleared
global.systems.blocker.on('blockers-cleared', () => global.systems.timer.unblock())

/* ------------------------------------------------------------------------- */
/* Update blockers when the power state updates */

// If on battery when the app is open, add a blocker

if (powerMonitor.isOnBatteryPower()) {
  if (global.store.get('preferences.blockers.blockOnBattery')) {
    global.systems.blocker.add({
      type: 'other',
      key: 'batteryPower',
      message: 'Your computer is running on battery power.'
    })
  }
}

// Add a blocker if switched to battery power
powerMonitor.on('on-battery', () => {
  if (global.store.get('preferences.blockers.blockOnBattery')) {
    global.systems.blocker.add({
      type: 'other',
      key: 'batteryPower',
      message: 'Your computer is running on battery power.'
    })
  }
})

// Remove the blocker if switched to AC power
powerMonitor.on('on-ac', () => {
  if (global.store.get('preferences.blockers.blockOnBattery')) {
    global.systems.blocker.remove('other', 'batteryPower')
  }
})

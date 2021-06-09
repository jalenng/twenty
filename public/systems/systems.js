/**
 * @file Initializes the various systems that manage the app logic, as well as
 * their interactions with each other.
 * @author jalenng
 */

const TimerSystem = require('./modules/TimerSystem')
const BreakSystem = require('./modules/BreakSystem')
const NotificationSystem = require('./modules/NotificationSystem')
const AppSnapshotSystem = require('./modules/AppSnapshotSystem')
const BlockerSystem = require('./modules/BlockerSystem')

const { sendToAllWindows } = require('../app/windowManager')
const store = require('../store/store')

const timerSystem = new TimerSystem()
const breakSystem = new BreakSystem()
const notificationSystem = new NotificationSystem()
const appSnapshotSystem = new AppSnapshotSystem()
const blockerSystem = new BlockerSystem()

/** Configure event listeners and connect the various systems */

// Start break when timer ends
timerSystem.on('timer-end', () => breakSystem.start())

// Create notification windows when break starts
breakSystem.on('break-start', () => notificationSystem.createWindows())

// Minimize notification when the break time is set/reset
breakSystem.on('break-times-set', () => notificationSystem.minimize())

// Expand notification when the break time is past the intermediate point
breakSystem.on('break-intermediate', () => notificationSystem.maximize())

// Close notification windows when break ends
breakSystem.on('break-end', () => notificationSystem.closeWindows())

// Start timer when break ends
breakSystem.on('break-end', () => timerSystem.start())

// Process the list of open apps through the blocker system when a snapshot is taken
appSnapshotSystem.on('app-snapshot-taken', (snapshot) => {
  blockerSystem.processAppSnapshot(snapshot)
})

// Block the timer when a blocker is detected
blockerSystem.on('blocker-detected', () => timerSystem.block())

// Unblock the timer when all blockers are cleared
blockerSystem.on('blockers-cleared', () => timerSystem.unblock())

//
timerSystem.on('timer-update', (timerStatus) => { sendToAllWindows('receive-timer-status', timerStatus) })

breakSystem.on('break-update', (breakStatus) => { sendToAllWindows('receive-break-status', breakStatus) })

/** If timer has stopped and the notification interval updates, update the timer with the new value. */
store.onDidChange('preferences.notifications.interval', () => {
  if (timerSystem.isStopped) timerSystem.update()
})

/** Export the systems */
module.exports = {
  timerSystem: timerSystem,
  breakSystem: breakSystem,
  notificationSystem: notificationSystem,
  appSnapshotSystem: appSnapshotSystem,
  blockerSystem: blockerSystem
}

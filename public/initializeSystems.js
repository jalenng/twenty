const { ipcMain, powerMonitor } = require('electron');

const TimerSystem = require('./systems/timerSystem');
const BreakSystem = require('./systems/breakSystem');
const NotificationSystem = require('./systems/notificationSystem');
const AppSnapshotSystem = require('./systems/appSnapshotSystem');
const DataUsageSystem = require('./systems/dataUsageSystem');
const BlockerSystem = require('./systems/blockerSystem');

// Instantiate the systems
global.timerSystem = new TimerSystem();
global.breakSystem = new BreakSystem();
global.notificationSystem = new NotificationSystem();
global.appSnapshotSystem = new AppSnapshotSystem();
global.dataUsageSystem = new DataUsageSystem();
global.blockerSystem = new BlockerSystem();


/*---------------------------------------------------------------------------*/
/* Start timer automatically based on user preferences */

if (global.store.get('preferences.startup.startTimerOnAppStartup'))
    global.timerSystem.start();


/*---------------------------------------------------------------------------*/
/* Update data usage systems based on user preferences */

global.dataUsageSystem.updateState();

// Update the status of the data usage system if the setting changes
store.onDidChange('preferences.dataUsage.trackAppUsageStats', () => {
    global.dataUsageSystem.updateState();
});


/*---------------------------------------------------------------------------*/
/* Update app snapshot systems based on user preferences */

global.appSnapshotSystem.updateState();

store.onDidChange('preferences.dataUsage.trackAppUsageStats', () => {
    global.appSnapshotSystem.updateState();
});

store.onDidChange('preferences.blockers.apps', () => {
    global.appSnapshotSystem.updateState();
});


/*---------------------------------------------------------------------------*/
/* Configure event listeners and connect the various systems */

// Start break when timer ends
global.timerSystem.on('timer-end', () => global.breakSystem.start());

// Create notification windows when break starts
global.breakSystem.on('break-start', () => global.notificationSystem.createWindows());

// Minimize notification when the break time is set/reset
global.breakSystem.on('break-times-set', () => global.notificationSystem.minimize());

// Expand notification when the break time is past the intermediate point
global.breakSystem.on('break-intermediate', () => global.notificationSystem.maximize());

// Close notification windows when break ends
global.breakSystem.on('break-end', () => global.notificationSystem.closeWindows());

// Start timer when break ends
global.breakSystem.on('break-end', () => global.timerSystem.start());

// Process the list of open apps through the data usage system when a snapshot is taken
global.appSnapshotSystem.on('app-snapshot-taken', (snapshot) => global.dataUsageSystem.processAppSnapshot(snapshot));

// Process the list of open apps through the blocker system when a snapshot is taken
global.appSnapshotSystem.on('app-snapshot-taken', (snapshot) => global.blockerSystem.processAppSnapshot(snapshot));

// Block the timer when a blocker is detected
global.blockerSystem.on('blocker-detected', () => global.timerSystem.block());

// Unblock the timer when all blockers are cleared
global.blockerSystem.on('blockers-cleared', () => global.timerSystem.unblock());

// Update timer usage when the timer ends
global.timerSystem.on('timer-end', (duration) => global.dataUsageSystem.registerTimerEnd(duration));


/*---------------------------------------------------------------------------*/
/* Update blockers when the power state updates */

// If on battery when the app is open, add a blocker

if (powerMonitor.isOnBatteryPower()) {
    if (global.store.get('preferences.blockers.blockOnBattery'))
        blockerSystem.add({
            type: 'other',
            key: 'batteryPower',
            message: 'Your computer is running on battery power.'
        });
}

// Add a blocker if switched to battery power
powerMonitor.on('on-battery', () => {
    if (global.store.get('preferences.blockers.blockOnBattery'))
        blockerSystem.add({
            type: 'other',
            key: 'batteryPower',
            message: 'Your computer is running on battery power.'
        });
});

// Remove the blocker if switched to AC power
powerMonitor.on('on-ac', () => {
    if (global.store.get('preferences.blockers.blockOnBattery'))
        blockerSystem.remove('other', 'batteryPower');
});


/*---------------------------------------------------------------------------*/
/* IPC event handlers */

// Reset the timer
ipcMain.handle('timer-reset', () => {
    global.timerSystem.reset();
})

// End the timer (and start the break)
ipcMain.handle('timer-end', () => {
    global.timerSystem.end();
})

// Get timer status
ipcMain.on('get-timer-status', (event) => {
    event.reply('receive-timer-status', global.timerSystem.getStatus());
});

// Toggle pause/play
ipcMain.handle('timer-toggle', () => {
    global.timerSystem.togglePause();
})

// Block the timer from running
ipcMain.handle('timer-block', () => {
    global.timerSystem.block();
})

// Get break status
ipcMain.on('get-break-status', (event) => {
    event.reply('receive-break-status', global.breakSystem.getStatus());
});

// Play sound file
ipcMain.handle('play-sound', () => {
    global.breakSystem.playSound();
});

// Get list of open windows
ipcMain.on('get-open-windows', async (event) => {
    event.returnValue = appSnapshotSystem.getLastSnapshot();
});

// Get timer status
ipcMain.on('get-blockers', (event) => {
    event.reply('receive-blockers', global.blockerSystem.getBlockers());
});

// Clear blockers
ipcMain.handle('clear-blockers', () => {
    global.blockerSystem.clear();
})
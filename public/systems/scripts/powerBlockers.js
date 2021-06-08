
const { powerMonitor } = require('electron')

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

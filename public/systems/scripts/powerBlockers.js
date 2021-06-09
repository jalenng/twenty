/**
 * @file Enables blockers to be updated based on the power state of the system.
 * @author jalenng
 */

const { powerMonitor } = require('electron')

const store = require('../../store/store')
const { blockerSystem } = require('../systems')

/* Update blockers when the power state updates */

// If on battery when the app is open, add a blocker
if (powerMonitor.isOnBatteryPower()) {
  if (store.get('preferences.blockers.blockOnBattery')) {
    blockerSystem.add({
      type: 'other',
      key: 'batteryPower',
      message: 'Your computer is running on battery power.'
    })
  }
}

// Add a blocker if switched to battery power
powerMonitor.on('on-battery', () => {
  if (store.get('preferences.blockers.blockOnBattery')) {
    blockerSystem.add({
      type: 'other',
      key: 'batteryPower',
      message: 'Your computer is running on battery power.'
    })
  }
})

// Remove the blocker if switched to AC power
powerMonitor.on('on-ac', () => {
  if (store.get('preferences.blockers.blockOnBattery')) {
    blockerSystem.remove('other', 'batteryPower')
  }
})

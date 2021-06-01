/**
 * @file Handles the logic of the timer-blocking feature.
 * @author jalenng
 *
 * The break system is also an event emitter that emits the following events:
 *  - blocker-detected: when a new blocker is detected
 *  - blockers-cleared: when all blockers have been dismissed or cleared
 */

const EventEmitter = require('./EventEmitter')

/**
 * Initializes a BlockerSystem.
 * @class
 */
module.exports = class BlockerSystem extends EventEmitter {
  constructor () {
    super()
    this.dismissedBlockers = []
    this.blockers = []
  }

  /**
   * Adds a blocker to the list of blockers
   * @param {Object} blocker - The blocker to add
   */
  add (blocker) {
    // Check if blocker already exists in the main list and dismissed list
    const combinedList = this.dismissedBlockers.concat(this.blockers)
    const foundEntry = combinedList.find(blocker2 => {
      return (blocker2.key === blocker.key && blocker2.type === blocker.type)
    })

    if (foundEntry === undefined) {
      this.blockers.push(blocker)
      this.notifyBlockerDetected()
    }
  }

  /**
   * Removes a blocker from the list if a given type and key match
   * @param {string} type - The type of the blockers to remove
   * @param {string} key - The key of the blockers to remove
   */
  remove (type, key) {
    const filterFunction = blocker => {
      return !(blocker.key === key && blocker.type === type)
    }

    this.blockers = this.blockers.filter(filterFunction)
    this.dismissedBlockers = this.dismissedBlockers.filter(filterFunction)
  }

  /**
   * Clears the list of blockers
   */
  clear () {
    this.dismissedBlockers = this.dismissedBlockers.concat(this.blockers)
    this.blockers = []
    this.notifyBlockersCleared()
  }

  /**
   * Update the blockers list according to the list of open processes
   */
  processAppSnapshot (openProcesses) {
    this.addOpenBlockedApps(openProcesses)
    this.removeClosedBlockedApps(openProcesses)
  }

  /**
   * Removes the app blockers in the blocker list for the apps that are not open
   * @param {Object[]} openProcesses - The list of open processes to filter from
   */
  removeClosedBlockedApps (openProcesses) {
    const blockedApps = global.store.get('preferences.blockers.apps')

    const filterFunction = blocker => {
      if (blocker.type !== 'app') return true

      const foundInOpenProcesses = openProcesses.find(process => process.path === blocker.key)
      if (foundInOpenProcesses === undefined) return false

      const foundInPreferencesList = blockedApps.find(appPath => appPath === blocker.key)
      if (foundInPreferencesList === undefined) return false

      return true
    }

    // Filter out the processes that are not open
    this.blockers = this.blockers.filter(filterFunction)
    this.dismissedBlockers = this.dismissedBlockers.filter(filterFunction)

    if (this.blockers.length === 0) this.notifyBlockersCleared()
  }

  /**
   * Create a new app blocker for every open app that is in the 'Blocker apps' list, and add it
   * to the blocker list.
   * @param {Object[]} openProcesses
   */
  addOpenBlockedApps (openProcesses) {
    const appNamesDict = global.store.get('appNames')
    const blockedApps = global.store.get('preferences.blockers.apps')

    // Iterate through list of open processes
    openProcesses.forEach(process => {
      const processPath = process.path

      // If open process matches element in the 'Blocker apps' list
      if (blockedApps.indexOf(processPath) !== -1) {
        // Add it to the list of app blockers
        this.add({
          type: 'app',
          key: processPath,
          message: appNamesDict[processPath]
        })
      }
    })
  }

  /**
   * Gets the present blockers
   * @returns {Object[]} - the list of blockers
   */
  getBlockers () { return this.blockers }

  /**
   * Emits the blockers-cleared event
   */
  notifyBlockersCleared () { this.emit('blockers-cleared') };

  /**
   * Emits the blocker-detected event
   */
  notifyBlockerDetected () { this.emit('blocker-detected') };
}

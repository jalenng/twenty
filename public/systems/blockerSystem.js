/*
The blocker system handles the logic of the timer-blocking feature. 

The break system is also an event emitter that emits the following events:
    - blocker-detected: when a new blocker is detected
    - blockers-cleared: when all blockers have been dismissed or cleared
*/

module.exports = function() {

    this._events = {};

    this.dismissedBlockers = [];
    this.blockers = [];

    /**
     * Registers an event listener
     */
    this.on = function (name, listener) {
        if (!this._events[name]) this._events[name] = [];
        this._events[name].push(listener);
    }

    /**
     * Emits an event and invokes the functions of its listeners
     * @param {string} eventName    name of event to emit
     * @param {(callback) => any} fireCallbacks 
     */
    this.emit = function (eventName, fireCallbacks=callback => callback()) {
        this._events[eventName].forEach(fireCallbacks);
    }

    /**
     * Adds a blocker to the list of blockers
     * @param {Object} blocker 
     */
    this.add = function (blocker) {

        // Check if blocker already exists in the main list and dismissed list
        const combinedList = this.dismissedBlockers.concat(this.blockers)
        const foundEntry = combinedList.find(blocker2 => {
            return (blocker2.key === blocker.key && blocker2.type === blocker.type)
        })

        if (foundEntry === undefined) {
            this.blockers.push(blocker);
            this.notifyBlockerDetected();
        }

    }

    /**
     * Removes a blocker to the list of blockers by type and key
     * @param {string} type 
     * @param {string} key 
     */
    this.remove = function (type, key) {
        const filterFunction = blocker => {
            return !(blocker.key === key && blocker.type === type);
        };
        
        this.blockers = this.blockers.filter(filterFunction);
        this.dismissedBlockers = this.dismissedBlockers.filter(filterFunction);
    }

    /**
     * Clears the list of blockers
     */
    this.clear = function () {
        this.dismissedBlockers = this.dismissedBlockers.concat(this.blockers);
        this.blockers = [];
        this.notifyBlockersCleared();
    }

    /**
     * Update the blockers list according to the list of open processes
     */
    this.processAppSnapshot = function (openProcesses) {
        this.addOpenBlockedApps(openProcesses);
        this.removeClosedBlockedApps(openProcesses);
    }

    /**
     * Removes the app blockers in the blocker list for the apps that are not open
     * @param {[Object]} openProcesses 
     */
    this.removeClosedBlockedApps = function(openProcesses) {
        const blockedApps = global.store.get('preferences.blockers.apps')

        const filterFunction = blocker => {
            if (blocker.type !== 'app') return true;

            const foundInOpenProcesses = openProcesses.find(process => process.path === blocker.key);
            if (foundInOpenProcesses == undefined) return false;

            const foundInPreferencesList = blockedApps.find(appPath => appPath === blocker.key);
            if (foundInPreferencesList == undefined) return false;

            return true;
        }

        // Filter out the processes that are not open
        this.blockers = this.blockers.filter(filterFunction);
        this.dismissedBlockers = this.dismissedBlockers.filter(filterFunction);

        if (this.blockers.length === 0) this.notifyBlockersCleared();
    }

    /**
     * Create a new app blocker for every open app that is in the 'Blocker apps' list, and add it
     * to the blocker list.
     * @param {[Object]} openProcesses 
     */
    this.addOpenBlockedApps = function (openProcesses) {

        const appNamesDict  = global.store.get('appNames');
        let blockedApps = global.store.get('preferences.blockers.apps')

        // Iterate through list of open processes
        openProcesses.forEach(process => {
            const processPath = process.path;

            // If open process matches element in the 'Blocker apps' list
            if (blockedApps.indexOf(processPath) != -1) {
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
     * @returns the list of blockers
     */
    this.getBlockers = () => { return this.blockers }

    /**
     * Emits the blockers-cleared event
     */
    this.notifyBlockersCleared = () => { this.emit('blockers-cleared') };

    /**
     * Emits the blocker-detected event
     */
    this.notifyBlockerDetected = () => { this.emit('blocker-detected') };

}
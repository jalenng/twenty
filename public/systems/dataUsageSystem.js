/*
The data usage system handles the aggregation of app-related and timer-related information.

The states of the data usage system are as follows:
    - isRunning
        - true <---> false
*/

module.exports = function () {

    this.isRunning = false;

    /**
     * Update the data usage store according to the list of open processes
     */
    this.processAppSnapshot = function (openProcesses) {
        const appNamesDict = global.store.get('appNames');
        const timestamp = this.getTimestamp();

        // Update app usage
        let appUsage = global.store.get('dataUsage.unsynced.appUsage');
        openProcesses.forEach(process => {
            const processPath = process.path;

            // Try to find an entry with the same path and timestamp
            const foundEntry = appUsage.find(app => {
                return (app.appPath === processPath && app.usageDate === timestamp);
            });

            // If this app has not been seen, add new entry
            if (foundEntry === undefined) {
                appUsage.push({
                    appName: appNamesDict[processPath],
                    appPath: processPath,
                    appTime: process.duration,
                    usageDate: timestamp
                })
            }
            // Else, just update existing entry
            else {
                appUsage = appUsage.filter(app => app.appPath != processPath); // Remove existing entry
                appUsage.push({ // Push updated entry
                    appName: appNamesDict[processPath],
                    appPath: processPath,
                    appTime: foundEntry.appTime + process.duration,
                    usageDate: timestamp
                })
            }
        })

        global.store.set('dataUsage.unsynced.appUsage', appUsage)
    }

    /**
     * Update the unsynced timer usage when the timer ends
     * @param usage 
     */
    this.registerTimerEnd = function (totalDuration) {
        const timestamp = this.getTimestamp();

        // Update timer usage
        let timerUsage = global.store.get('dataUsage.unsynced.timerUsage');

        // Try to find an entry with the same timestamp
        const foundEntry = timerUsage.find(entry => entry.usageDate === timestamp);

        // If there is no such entry, add new entry
        if (foundEntry === undefined) {
            timerUsage.push({
                screenTime: totalDuration,
                timerCount: 1,
                usageDate: timestamp
            })
        }
        // Else, just update existing entry
        else {
            timerUsage = timerUsage.filter(entry => entry.usageDate != timestamp); // Remove existing entry
            timerUsage.push({ // Push updated entry
                screenTime: foundEntry.screenTime + totalDuration,
                timerCount: foundEntry.timerCount + 1,
                usageDate: timestamp
            })
        }

        global.store.set('dataUsage.unsynced.timerUsage', timerUsage)

        console.log(JSON.stringify(store.get('dataUsage.unsynced.timerUsage')))
    }

    /**
     * Helper function to retrieve the current timestamp
     */
    this.getTimestamp = function () {
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = ("00" + (now.getMonth() + 1)).substr(-2, 2);
        const nowDate = ("00" + now.getDate()).substr(-2, 2);
        return (`${nowYear}-${nowMonth}-${nowDate}`);
    }

    /**
     * Starts the data usage system.
     */
    this.startSystem = function () {
        if (!this.isRunning) this.isRunning = true;
    }

    /**
     * Stops the data usage system.
     */
    this.stopSystem = function () {
        if (this.isRunning) this.isRunning = false;
    }

    /**
     * Starts or stops the data usage system depending on user preferences
     */
    this.updateState = function () {
        if (global.store.get('preferences.dataUsage.trackAppUsageStats'))
            this.startSystem();
        else
            this.stopSystem();
    }
}
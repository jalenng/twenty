/*
The app snapshot system handles capturing the list of open windows on the user's computer.

The states of the app snapshot usage system are as follows:
    - isRunning
        - true <---> false

The app snapshot system is also an event emitter that emits the following events:
    - app-snapshot-taken: emitted whenever a snapshot has been taken (usually on an interval)
*/

const psShell = require('node-powershell');
const isWindows = process.platform == 'win32';

const APP_SNAPSHOT_INTERVAL = 5000;
const POWERSHELL_GET_PROCESS_COMMAND =
    `Get-Process | Where-Object {$_.mainWindowTitle} | Select-Object Name, mainWindowtitle, Description, Path | ConvertTo-Json | % {$_ -replace("\\u200B")} | % {$_ -replace("\\u200E")}`;

module.exports = function() {

    this._events = {};

    this.isRunning = false;
    this.lastSnapshot = [];

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
     * Takes a snapshot of the list of open windows, and update the dictionary of friendly app names accordingly.
     * This emits the 'app-snapshot-taken' event.
     * @returns {[Object]} List of open windows
     */
    this.takeAppSnapshot = async function () {
        let result = [];

        // WINDOWS: Invoke PowerShell command to get open windows
        if (isWindows) {
            try {
                let newAppNames = {};

                // Set up PowerShell child process, invoke command, then kill it.
                const ps = new psShell({
                    executionPolicy: 'Bypass',
                    noProfile: true
                }); 
                ps.addCommand(POWERSHELL_GET_PROCESS_COMMAND);
                const psOutput = await ps.invoke();
                ps.dispose();

                // Evaluate the JSON string output to a JSON object
   
                const psJson = eval(psOutput)

                psJson.forEach(process => {
                    const winTitle = process.MainWindowTitle;
                    const winDesc = process.Description;
                    const winPath = process.Path;

                    // Push process to list of open windows
                    result.push({
                        path: winPath,
                        duration: APP_SNAPSHOT_INTERVAL
                    });
                    
                    // Perform processing to get the ideal name
                    if (winTitle.indexOf(winDesc) === -1 || winDesc === '')
                        newAppNames[winPath] = winTitle;
                    else
                        newAppNames[winPath] = winDesc;
                })

                // Update the app names dictionary
                let appNamesDict = global.store.get('appNames');
                appNamesDict = {...appNamesDict, ...newAppNames};
                global.store.set('appNames', appNamesDict);

            }
            catch (error) { console.log(error) }
        }

        // Call app-snapshot-taken listeners
        this.emit('app-snapshot-taken', (callback) => callback(result));
        
        lastSnapshot = result;

        return result;
    }

    /**
     * Starts the app snapshot system.
     */
    this.startSystem = function () {
        if (!this.isRunning) {
            // Set interval to take snapshots of open processes
            interval = setInterval(this.takeAppSnapshot.bind(this), APP_SNAPSHOT_INTERVAL);

            this.isRunning = true;

            //Take first snapshot
            this.takeAppSnapshot();
        }
    }

    /**
     * Stops the app snapshot system.
     */
    this.stopSystem = function () {
        if (this.isRunning) {
            clearInterval(interval);
            this.isRunning = false;
        }
    }

    /**
     * Retrieves the last snapshot of the list of open windows
     * @returns the last app snapshot
     */
    this.getLastSnapshot = function () {
        return lastSnapshot;
    }

    /**
     * Starts or stops the app snapshot system depending on user preferences
     */
    this.updateState = function () {
        // Check if option to track app usage stats are on
        const trackAppUsageStats = global.store.get('preferences.dataUsage.trackAppUsageStats');

        // Check if any apps are set as blockers
        const appBlockers = global.store.get('preferences.blockers.apps');

        if (trackAppUsageStats || (appBlockers.length != 0)) this.startSystem();
        else this.stopSystem();
    }

}
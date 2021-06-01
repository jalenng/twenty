/**
 * @file Handles capturing the list of open windows on the user's computer.
 * @author jalenng
 * The states of the app snapshot usage system are as follows:
 *  - isRunning
 *  - true <---> false
 *
 * The app snapshot system is also an event emitter that emits the following events:
 *  - app-snapshot-taken: emitted whenever a snapshot has been taken (usually on an interval)
 */

const PowerShell = require('node-powershell')
const EventEmitter = require('./EventEmitter')

const { isWindows, appFilePath } = require('../constants.js')

const APP_SNAPSHOT_INTERVAL = 5000
const POWERSHELL_GET_PROCESS_COMMAND =
  'Get-Process | Where-Object {$_.mainWindowTitle} | Select-Object Name, mainWindowtitle, Description, Path | ConvertTo-Json | % {$_ -replace("\\u200B")} | % {$_ -replace("\\u200E")}'

/**
 * Initializes an AppSnapshotSystem.
 * @class
 */
module.exports = class AppSnapshotSystem extends EventEmitter {
  constructor () {
    super()
    this.isRunning = false
    this.lastSnapshot = []
    this.startSystem()
  }

  /**
   * Takes a snapshot of the list of open windows, and update the dictionary of friendly app names accordingly.
   * This emits the 'app-snapshot-taken' event.
   * @returns {Object[]} - List of open windows
   */
  async takeAppSnapshot () {
    const result = []

    // WINDOWS: Invoke PowerShell command to get open windows
    if (isWindows) {
      try {
        const newAppNames = {}

        // Set up PowerShell child process, invoke command, then kill it.
        const ps = new PowerShell({
          executionPolicy: 'Bypass',
          noProfile: true
        })
        ps.addCommand(POWERSHELL_GET_PROCESS_COMMAND)
        const psOutput = await ps.invoke()
        ps.dispose()

        // Evaluate the JSON string output to a JSON object
        const psJson = JSON.parse(psOutput)

        psJson.forEach(process => {
          const winTitle = process.MainWindowTitle
          const winDesc = process.Description
          const winPath = process.Path

          // Exclude self
          if (winPath === appFilePath) return

          // Push process to list of open windows
          result.push({
            path: winPath,
            duration: APP_SNAPSHOT_INTERVAL
          })

          // Perform processing to get the ideal name
          if (winTitle.indexOf(winDesc) === -1 || winDesc === '') {
            newAppNames[winPath] = winTitle
          } else {
            newAppNames[winPath] = winDesc
          }
        })

        // Update the app names dictionary
        let appNamesDict = global.store.get('appNames')
        appNamesDict = { ...appNamesDict, ...newAppNames }
        global.store.set('appNames', appNamesDict)
      } catch (error) { console.log(error) }
    }

    // Call app-snapshot-taken listeners
    this.emit('app-snapshot-taken', (callback) => callback(result))

    this.lastSnapshot = result

    return result
  }

  /**
   * Starts the app snapshot system.
   */
  startSystem () {
    if (!this.isRunning) {
      // Set interval to take snapshots of open processes
      this.interval = setInterval(this.takeAppSnapshot.bind(this), APP_SNAPSHOT_INTERVAL)

      this.isRunning = true

      // Take first snapshot
      this.takeAppSnapshot()
    }
  }

  /**
   * Stops the app snapshot system.
   */
  stopSystem () {
    if (this.isRunning) {
      clearInterval(this.interval)
      this.isRunning = false
    }
  }

  /**
   * Retrieves the last snapshot of the list of open windows
   * @returns {Object[]} - The latest app snapshot.
   */
  getLastSnapshot () {
    return this.lastSnapshot
  }
}

/**
 * @file Entry point for Electron's main process.
 * @author jalenng
 */

// First, ensure single instance.
require('./enforceInstance') // App may quit here if it fails to acquire the lock

// Next, set up the underlying logic by initializing the store, systems, and IPC handlers
require('./store/store')
require('./systems/systems')

// Then, set up the IPC functions to allow the main process to communicate with the renderer window
require('./ipc/appIPC')
require('./ipc/storeIPC')
require('./ipc/systemsIPC')

// Finally, initialize the Electron app and its windows
require('./app/initializeApp')

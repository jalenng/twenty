/**
 * @file Entry point for Electron's main process.
 * @author jalenng
 */

// First, ensure single instance.
require('./enforceInstance') // App may quit here if it fails to acquire the lock

// Next, set up the underlying logic by initializing the stores and systems
require('./store/initializeStore')
require('./systems/setupSystems')

// Finally, initialize the Electron app and its windows
require('./app/initializeApp')

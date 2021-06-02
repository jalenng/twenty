/**
 * @file Entry point for Electron's main process.
 * @author jalenng
 */

// First, ensure single instance.
require('./enforceInstance') // App quits if it failed to get the lock

// Initialize the stores and systems
require('./store/initializeStore')
require('./systems/initializeSystems')

// Initialize the app and its windows
require('./app/initializeApp')

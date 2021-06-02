const { ipcMain } = require('electron')

/* ------------------------------------------------------------------------- */
/* System-related */

// Reset the timer
ipcMain.handle('timer-reset', () => {
  global.systems.timer.reset()
})

// End the timer (and start the break)
ipcMain.handle('timer-end', () => {
  global.systems.timer.end()
})

// Toggle pause/play
ipcMain.handle('timer-toggle', () => {
  global.systems.timer.togglePause()
})

// Block the timer from running
ipcMain.handle('timer-block', () => {
  global.systems.timer.block()
})

// Get break status
ipcMain.on('get-break-status', (event) => {
  event.reply('receive-break-status', global.systems.break.getStatus())
})

// Play sound file
ipcMain.handle('play-sound', () => {
  global.systems.break.playSound()
})

// Get list of open windows
ipcMain.on('get-open-windows', async (event) => {
  event.returnValue = global.systems.appSnapshot.getLastSnapshot()
})

// Get timer status
ipcMain.on('get-blockers', (event) => {
  event.reply('receive-blockers', global.systems.blocker.getBlockers())
})

// Clear blockers
ipcMain.handle('clear-blockers', () => {
  global.systems.blocker.clear()
})

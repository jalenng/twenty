const path = require('path')

const { app, nativeTheme, nativeImage, Menu, Tray } = require('electron')

let appTray = null

// Function to get path of icon file
const getTrayImage = function () {
  // Calculate percentage
  const timerStatus = global.timerSystem.getStatus()
  const percentage = timerStatus.remainingTime / timerStatus.totalDuration * 100
  const percentageMultOfFive = Math.round(percentage / 5) * 5

  const folder = process.platform === 'darwin'
    ? 'template'
    : nativeTheme.shouldUseDarkColors
      ? 'white'
      : 'black'

  const imagePath = path.join(__dirname, `../tray_assets/${folder}/${percentageMultOfFive}.png`)

  return nativeImage.createFromPath(imagePath)
}

const contextMenu = Menu.buildFromTemplate([
  { label: app.getName(), enabled: false },
  { type: 'separator' },
  { label: 'Quit', click: app.exit }
])

appTray = new Tray(getTrayImage())
appTray.setToolTip(app.getName())
appTray.setContextMenu(contextMenu)
appTray.on('click', () => {
  global.mainWindow.show()
  global.mainWindow.focus()
})

// Update system tray icon on an interval
setInterval(() => {
  appTray.setImage(getTrayImage())
}, 5000)

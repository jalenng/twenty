const { autoUpdater } = require('electron-updater')
const logger = require('electron-log')

// Configure logging for debugging
logger.transports.file.level = 'info'
autoUpdater.logger = logger

autoUpdater.autoDownload = false
autoUpdater.fullChangelog = true
autoUpdater.allowPrerelease = true

module.exports = {

  check: function () {
    return new Promise(function (resolve, reject) {
      autoUpdater.checkForUpdates()

      autoUpdater.on('update-available', (updateInfo) => {
        resolve(updateInfo)
      })

      autoUpdater.on('update-not-available', () => {
        resolve(null)
      })

      autoUpdater.on('error', (error) => {
        reject(error)
      })
    })
  },

  download: function () {
    return new Promise(function (resolve, reject) {
      autoUpdater.downloadUpdate()

      autoUpdater.on('update-downloaded', (info) => {
        logger.info(info)
        resolve(info)
      })

      autoUpdater.on('error', (error) => {
        reject(error)
      })
    })
  }
}

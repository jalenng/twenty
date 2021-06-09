/**
 * @file Shared constants
 * @author jalenng
 */

const path = require('path')

const { app } = require('electron')

module.exports = {
  isWindows: process.platform === 'win32',
  isMacOS: process.platform === 'darwin',
  isDev: require('electron-is-dev'),

  appName: app.getName(),
  appFilePath: app.getPath('exe'),

  defaultSoundsPath: path.join(__dirname, '..', 'sounds')
}

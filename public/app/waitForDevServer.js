const { net } = require('electron')

function waitForDevServer (port = 3000) {
  return new Promise((resolve) => {
    const tryConnection = () => {
      const request = net.request(`http://localhost:${port}`)
      request.on('response', (response) => {
        if (response.statusCode === 200) {
          resolve()
        } else {
          setTimeout(tryConnection, 1000)
        }
      })
      request.on('error', () => {
        setTimeout(tryConnection, 1000)
      })
      request.end()
    }
    tryConnection()
  })
}

module.exports = waitForDevServer
const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

// Describe: a group/suite of test cases
describe('Application launch', function () {
    
    this.app
    this.timeout(60000) // Give 60 seconds for entire test suite to run

    // Set precondition
    beforeEach(function () {
        this.timeout(20000) // Give 20 seconds for Electron to open
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')]
        })
        return this.app.start()
    })

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    })

    // Test case
    it('shows an initial window', function () {
        console.log(this.app)
        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1)
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        })
    })
})
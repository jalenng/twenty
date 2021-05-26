const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");

/**
 * describe()
 *  - Describes a group/suite of test cases
 *  - Test cases in a test suite share the same precondition setup
 * 
 * beforeEach()
 *  - A hook to define the precondition
 *  - Runs once before running each test case
 * 
 * it()
 *  - Describes a test case in the test suite
 *  - Each test suite can have multiple test cases (or multiple it()'s)
 * 
 * afterEach()
 *  - A hook to perform cleanup
 *  - Runs once after each test case
 * 
 */

describe("App launch", function () {
    this.timeout(60000); // Give 60 seconds for entire test suite to run
    this.app;

    beforeEach(function () {
        this.timeout(30000); // Give 30 seconds for Electron to open
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, "..")],
            requireName: 'electronRequire'
        });
        return this.app.start();
    });

    it("Window initialization", async function () {

        const count = this.app.client.getWindowCount();
        const isVisible = this.app.browserWindow.isVisible();
        const title = this.app.browserWindow.getTitle();
        const bounds = this.app.browserWindow.getBounds();
        const isMaximizable = this.app.browserWindow.isMaximizable();
        const isMinimizable = this.app.browserWindow.isMinimizable();
        const isClosable = this.app.browserWindow.isClosable();

        assert.strictEqual(await count, 1);
        assert.strictEqual(await isVisible, true);
        assert.strictEqual(await title, "iCare");

        assert.strictEqual((await bounds).height >= 550, true);
        assert.strictEqual((await bounds).width >= 860, true);
        
        assert.strictEqual(await isMaximizable, false);
        assert.strictEqual(await isMinimizable, true);
        assert.strictEqual(await isClosable, true);

    });

    afterEach(function () {
        if (this.app && this.app.isRunning())
            return this.app.stop()
    });

});
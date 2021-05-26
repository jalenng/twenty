const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

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
 *  - A hook to perform cleanups
 *  - Runs once after each test case
 * 
 */

/**
 * FluentUI's 'Button' == 'button'
 * FluentUI's 'TextField' == 'input'
 */

describe('Preferences', function () {
    this.timeout(60000); // Give 60 seconds for entire test suite to run
    this.app;

    beforeEach(async function () {
        this.timeout(30000); // Give 30 seconds for Electron to open
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')],
            requireName: 'electronRequire'
        });
        await this.app.start();

        // Wait for window to be visible
        const isVisible = await this.app.browserWindow.isVisible();
        assert.strictEqual(isVisible, true);
        
        // Select settings button to open the settings menu.
        const openSettingsBtn = await this.app.client.react$('button', { 
            props: { id : 'Pivot1-Tab3' }
        });

        await openSettingsBtn.click();
        await wait(1000);
    });

    it('Toggling enable sound notifications', async function () {
        // Click the notification menu.
        const openNotifBtn = await this.app.client.react$('button', { 
            props: { title : 'Notifications' }
        });
        await openNotifBtn.click();
        await wait(2000)

        // Toggle the app startup button.
        const soundNotifsToggle = await this.app.client.react$('button', {
            props: { id : 'soundNotifsToggle' }
        });
        const beforeClick = await soundNotifsToggle.getProperty('checked');
        await soundNotifsToggle.click();
        await wait(2000);
        const afterClick = await soundNotifsToggle.getProperty('checked');
        assert.notStrictEqual(beforeClick, afterClick);
    });

    it('Playing default notification sound.', async function () {

        // Click the notification menu.
        const openNotifBtn = await this.app.client.react$('button', { 
            props: { title : 'Notifications' }
        });
        await openNotifBtn.click();
        await wait(2000);

        const playSoundBtn = await this.app.client.react$('button', {
            props: { id : 'playSoundBtn' }
        })

        await playSoundBtn.click();
        await wait(2000);
    });

    it('Toggling open iCare on startup', async function () {
        // Click the startup menu.
        const openStartupBtn = await this.app.client.react$('button', { 
            props: { title : 'Startup' }
        });
        await openStartupBtn.click();
        await wait(2000)

        // Click/Toggle the app startup button.
        const appStartupToggle = await this.app.client.react$('button', {
            props: { id : 'appStartupToggle' }
        });

        const beforeClick = await appStartupToggle.getProperty('checked');
        await appStartupToggle.click();
        await wait(2000);
        const afterClick = await appStartupToggle.getProperty('checked');
        assert.notStrictEqual(beforeClick, afterClick);
    });

    it('Toggling track app usage statistics', async function () {

        // Click the data usage menu.
        const openUsageBtn = await this.app.client.react$('button', { 
            props: { title : 'Data usage' }
        });
        await openUsageBtn.click();
        await wait(2000)

        // Click/toggle track app usage statistics.
        const appUsageToggle = await this.app.client.react$('button', {
            props: { id : 'appUsageToggle' }
        });
        const beforeClick = await appUsageToggle.getProperty('checked');
        await appUsageToggle.click();
        await wait(2000);
        const afterClick = await appUsageToggle.getProperty('checked');
        assert.notStrictEqual(beforeClick, afterClick);
    });

    it('Toggling track data usage statistics', async function () {

        // Click the data usage menu.
        const openUsageBtn = await this.app.client.react$('button', { 
            props: { title : 'Data usage' }
        });
        await openUsageBtn.click();
        await wait(2000)

        // Click/toggle track app usage statistics.
        const dataUsageToggle = await this.app.client.react$('button', {
            props: { id : 'dataUsageToggle' }
        });
        const beforeClick = await dataUsageToggle.getProperty('checked');
        await dataUsageToggle.click();
        await wait(2000);
        const afterClick = await dataUsageToggle.getProperty('checked');
        assert.notStrictEqual(beforeClick, afterClick);
    });

    it('Modifying timer duration', async function () {
        // Click the notification menu.
        const openNotifBtn = await this.app.client.react$('button', { 
            props: { title : 'Notifications' }
        });
        await openNotifBtn.click();
        await wait(2000);

        const notifSlider = await this.app.client.react$('div', {
            props: { id : 'Slider99' }
        });

        await notifSlider.click();
        await wait(2000);
    });

    afterEach(function () {
        // Try to return focus to the main window
        this.app.client.switchWindow('iCare')

        if (this.app && this.app.isRunning())
            return this.app.stop();
    });
});

/* Helper function to pause execution for a given amount of time */
function wait(milliseconds) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => { resolve() }, milliseconds)
    })
}
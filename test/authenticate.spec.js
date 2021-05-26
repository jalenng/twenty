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
 *  - A hook to perform cleanups
 *  - Runs once after each test case
 * 
 */

/**
 * FluentUI's 'Button' == 'button'
 * FluentUI's 'TextField' == 'input'
 */

describe("Authenticate", function () {
    this.timeout(60000); // Give 60 seconds for entire test suite to run
    this.app;

    beforeEach(async function () {
        this.timeout(30000); // Give 30 seconds for Electron to open
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, "..")],
            requireName: 'electronRequire'
        });
        await this.app.start();

        // Wait for window to be visible
        const isVisible = await this.app.browserWindow.isVisible();
        assert.strictEqual(isVisible, true);
        
        // Select top-right sign-in button to open the popup window
        const signInPopupBtn = await this.app.client.react$('button', { 
            props: { id: 'signInPopupButton' }
        });
        signInPopupBtn.click();

        await wait(2000)

        // Try to shift focus to the popup window
        this.app.client.switchWindow('Sign in')
    });

    it('Sign in with empty input', async function() {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();

        const signInBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signInBtn.click();

        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should be a failed login
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    })

    it('Sign in with invalid credentials', async function() {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();

        const emailField = await this.app.client.react$('input', { 
            props: { id: 'email' }
        });
        emailField.addValue('not an account');

        const passwordField = await this.app.client.react$('input', { 
            props: { id: 'password' }
        });
        passwordField.addValue('not a password');

        const signInBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signInBtn.click();

        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should be a failed login
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    })

    it('Sign in with valid credentials', async function() {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        
        const emailField = await this.app.client.react$('input', { 
            props: { id: 'email' }
        });
        emailField.addValue('tester@gmail.com');

        const passwordField = await this.app.client.react$('input', { 
            props: { id: 'password' }
        });
        passwordField.addValue('testertester');

        const signInBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signInBtn.click();

        // Wait for backend response
        await wait(2000)

        // Make sure the popup closed since it should be a successful login
        assert.strictEqual(numWindows - 1, await this.app.client.getWindowCount());
    })

    it("Click [Already have an account?] to return to sign in screen", async function () {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        await wait (2000)
        const signUpDirectBtn = await this.app.client.react$('button', { 
            props: { id: 'noAccountLink' }
        });
        signUpDirectBtn.click();
        // Wait for backend response
        await wait(2000)

        const signInReturnBtn = await this.app.client.react$('button', { 
            props: { id: 'alreadyHaveAccount' }
        });

        signInReturnBtn.click();
        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should just return to the sign in window
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    });  

    it("Sign up with empty fields", async function () 
    {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        await wait (2000)
        const signUpDirectBtn = await this.app.client.react$('button', { 
            props: { id: 'noAccountLink' }
        });
        signUpDirectBtn.click();

        // Wait for backend response
        await wait(2000)

        // Try to shift focus to the popup window
        this.app.client.switchWindow('Sign in')

        const signUpBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signUpBtn.click();

        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should be a failed sign up
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    });

    it("Sign up with email that already exists", async function () 
    {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        await wait (2000)
        const signUpDirectBtn = await this.app.client.react$('button', { 
            props: { id: 'noAccountLink' }
        });
        signUpDirectBtn.click();

        // Wait for backend response
        await wait(2000)

        // Try to shift focus to the popup window
        this.app.client.switchWindow('Sign in')

        const nameField = await this.app.client.react$('input', { 
            props: { id: 'displayName' }
        });
        nameField.addValue('iCare');

        const emailField = await this.app.client.react$('input', { 
            props: { id: 'email' }
        });
        emailField.addValue('iCare@gmail.com');

        const passwordField = await this.app.client.react$('input', { 
            props: { id: 'password' }
        });
        passwordField.addValue('icarepass');

        const confirmPasswordField = await this.app.client.react$('input', { 
            props: { id: 'confirm' }
        });
        confirmPasswordField.addValue('icarepass');

        const signUpBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signUpBtn.click();
        
        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should be a failed sign up
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    });

    it("Sign up with password that does not meet requirements", async function () 
    {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        await wait (2000)
        const signUpDirectBtn = await this.app.client.react$('button', { 
            props: { id: 'noAccountLink' }
        });
        signUpDirectBtn.click();

        // Wait for backend response
        await wait(2000)

        // Try to shift focus to the popup window
        this.app.client.switchWindow('Sign in')

        const nameField = await this.app.client.react$('input', { 
            props: { id: 'displayName' }
        });
        nameField.addValue('iCare');

        const emailField = await this.app.client.react$('input', { 
            props: { id: 'email' }
        });
        emailField.addValue('iCare@email.com');

        const passwordField = await this.app.client.react$('input', { 
            props: { id: 'password' }
        });
        passwordField.addValue('pass');

        const confirmPasswordField = await this.app.client.react$('input', { 
            props: { id: 'confirm' }
        });
        confirmPasswordField.addValue('pass');

        const signUpBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signUpBtn.click();

        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should be a failed sign up
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    });

    it("Sign up with password that does not match confirmation password", async function () 
    {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        await wait (2000)
        const signUpDirectBtn = await this.app.client.react$('button', { 
            props: { id: 'noAccountLink' }
        });
        signUpDirectBtn.click();

        // Wait for backend response
        await wait(2000)

        // Try to shift focus to the popup window
        this.app.client.switchWindow('Sign in')

        const nameField = await this.app.client.react$('input', { 
            props: { id: 'displayName' }
        });
        nameField.addValue('iCare');

        const emailField = await this.app.client.react$('input', { 
            props: { id: 'email' }
        });
        emailField.addValue('iCare@email.com');

        const passwordField = await this.app.client.react$('input', { 
            props: { id: 'password' }
        });
        passwordField.addValue('pass');

        const confirmPasswordField = await this.app.client.react$('input', { 
            props: { id: 'confirm' }
        });
        confirmPasswordField.addValue('icarepass');

        const signUpBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signUpBtn.click();
        
        // Wait for backend response
        await wait(2000)

        // Make sure the popup didn't close since it should be a failed sign up
        assert.strictEqual(numWindows, await this.app.client.getWindowCount());
    });

    it("Sign up with valid email and password", async function () 
    {
        // Get number of open windows
        const numWindows = await this.app.client.getWindowCount();
        await wait (2000)
        const signUpDirectBtn = await this.app.client.react$('button', { 
            props: { id: 'noAccountLink' }
        });
        signUpDirectBtn.click();

        // Wait for backend response
        await wait(2000)

        // Try to shift focus to the popup window
        this.app.client.switchWindow('Sign in')

        const nameField = await this.app.client.react$('input', { 
            props: { id: 'displayName' }
        });
        nameField.addValue('iCare');

        const emailField = await this.app.client.react$('input', { 
            props: { id: 'email' }
        });
        emailField.addValue('iCare@email.com');

        const passwordField = await this.app.client.react$('input', { 
            props: { id: 'password' }
        });
        passwordField.addValue('icarepass');

        const confirmPasswordField = await this.app.client.react$('input', { 
            props: { id: 'confirm' }
        });
        confirmPasswordField.addValue('icarepass');

        const signUpBtn = await this.app.client.react$('button', { 
            props: { id: 'submitButton' }
        });
        signUpBtn.click();
        
        // Wait for backend response
        await wait(2000)

        // Make sure the popup closed since it should be a successful sign up
        assert.strictEqual(numWindows - 1, await this.app.client.getWindowCount());
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
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

describe("Timer functionality", function () {
  this.timeout(60000); // Give 60 seconds for entire test suite to run
  this.app;

  beforeEach(function () {
    this.timeout(30000); // Give 30 seconds for Electron to open
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")],
      requireName: "electronRequire",
    });
    return this.app.start();
  });

  it("Starting and pausing the timer", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);

    const timerComp = await this.app.client.react$("Timer");
    const toggleButton = await timerComp.react$("button", {
      // FluentUI's 'Buttons' are 'buttons'
      props: { id: "toggleButton" },
    });
    const remainingTimeComp = await timerComp.react$("div", {
      props: { id: "remainingTimeText" },
    });

    // Timer should be running by default

    await toggleButton.click(); // Pause the timer

    // Check if the timer's remaining time is changing
    const remainingTimeText = await remainingTimeComp.getText();
    await wait(3000); // Wait 3 seconds
    assert.strictEqual(remainingTimeText, await remainingTimeComp.getText()); // Remaining time shouldn't change

    await toggleButton.click(); // Unpause the timer

    // Check if the timer's remaining time is changing
    await wait(3000); // Wait 3 seconds
    assert.notStrictEqual(remainingTimeText, await remainingTimeComp.getText()); // Remaining time should change

    await wait(3000); // Wait 3 seconds
  });

  it("Resetting the timer", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);

    const timerComp = await this.app.client.react$("Timer");

    const buttonGroup = await timerComp.react$("button", {
      props: { id: "buttonGroup" },
    });
    await buttonGroup.click();
    const resetBtn = await buttonGroup.getProperty("items");
    console.log(resetBtn);
    // await resetBtn[0].click();

    await wait(10000);

    // await resetBtn.click();
    // const remainingTimeComp = await timerComp.react$("div", {
    //   props: { id: "remainingTimeText" },
    // });

    // const remainingTimeText = await remainingTimeComp.getText();
    // assert.strictEqual(remainingTimeText, "20:00");
  });



  afterEach(function () {
    if (this.app && this.app.isRunning()) return this.app.stop();
  });
});

/* Helper function to pause execution for a given amount of time */
function wait(milliseconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

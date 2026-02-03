/**
 * @file Holds the functions needed to set up the app's system tray menu and icon.
 * @author jalenng
 */

const path = require("path");

const { app, nativeTheme, nativeImage, Menu, Tray } = require("electron");

const { appName, isMacOS } = require("../constants");
const { timerSystem } = require("../systems/systems");
const createWindow = require("./createWindow");
const { mainWindow, windowStillExists } = require("./windowManager");

const contextMenu = Menu.buildFromTemplate([
  { label: appName, click: showMainWindow },
  { type: "separator" },
  { label: "Quit", click: app.exit },
]);

/**
 * Determines the path of the tray icon image based on the OS and timer status.
 * @returns {String} the path of the image file to use
 */
function getTrayImage() {
  // Calculate percentage
  const timerStatus = timerSystem.getStatus();
  const percentage = (timerStatus.remainingTime / timerStatus.totalDuration) * 100;
  const percentageMultOfFive = Math.round(percentage / 5) * 5;

  const folder = isMacOS ? "template" : nativeTheme.shouldUseDarkColors ? "white" : "black";

  const filename = isMacOS ? `${percentageMultOfFive}Template.png` : `${percentageMultOfFive}.png`;
  const imagePath = path.join(__dirname, "..", "..", "tray_assets", folder, filename);
  const image = nativeImage.createFromPath(imagePath);

  return image;
}

function createTray() {
  const tray = new Tray(getTrayImage());
  tray.setToolTip(appName);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    showMainWindow();
  });

  // Update system tray icon on an interval
  setInterval(() => {
    tray.setImage(getTrayImage());
  }, 5000);
}

function showMainWindow() {
  if (windowStillExists(mainWindow.get())) {
    mainWindow.get().show();
  } else {
    mainWindow.set(createWindow("main"));
    mainWindow.get().show();
  }
}

/** Export tray reference and function to create tray */
module.exports = {
  createTray,
};

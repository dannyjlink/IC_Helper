"use strict";

import { app, protocol, ipcMain, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const showDevTools = !process.argv.includes("--no-devtools");

const APP_PROTOCOL = "app";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows = [];
let createdAppProtocol = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: APP_PROTOCOL, privileges: { secure: true, standard: true } },
]);

function createWindow(route) {
  if (typeof route === "undefined") route = "";

  let width, height, frame;
  switch (route) {
    case "toast":
      width = 350;
      height = 150;
      frame = false;
      break;
    default:
      width = 1920;
      height = 1080;
      frame = true;
      break;
  }

  // Create the browser window.
  let win = new BrowserWindow({
    width,
    height,
    frame,
    autoHideMenuBar: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,

      enableRemoteModule: true,
    },
  });
  
  protocol.registerFileProtocol('file', (request, cb) => {
    const url = request.url.replace('file:///', '')
    const decodedUrl = decodeURI(url)
    try {
      return cb(decodedUrl)
    } catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "#/" + route);
    if (!process.env.IS_TEST && showDevTools) win.webContents.openDevTools();
  } else {
    if (!createdAppProtocol) {
      createProtocol(APP_PROTOCOL);
      createdAppProtocol = true;
    }
    // Load the index.html when not in development
    win.loadURL(APP_PROTOCOL + "://./index.html#/" + route);
  }

  windows.push(win);

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // TODO: untested
  if (windows.length === 0) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("new-window", (e, route) => {
  createWindow(route);
});

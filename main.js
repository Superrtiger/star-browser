const { nativeTheme } = require("electron");
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
} = require("electron/main");
if (require("electron-squirrel-startup")) app.quit();

const path = require("node:path");
const iconPath = path.join(__dirname, "images", "logos", "256.png");

function createWindow(
  loadDefaultFile = true,
  options = null,
  browserURL = null
) {
  let mainWindow = null;
  if (options == null) {
    mainWindow = new BrowserWindow({
      width: 1080,
      icon: iconPath,
      height: 720,
      webPreferences: {
        webviewTag: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });
  } else {
    mainWindow = new BrowserWindow(options);
  }

  mainWindow.setAutoHideMenuBar(true);

  if (loadDefaultFile != false && browserURL != null) {
    mainWindow.loadFile("index.html").then(() => {
      mainWindow.webContents.send("setWindowURL", browserURL);
    });
  } else if (loadDefaultFile != false) mainWindow.loadFile("index.html");

  nativeTheme.themeSource = "dark";

  return mainWindow;
}

ipcMain.on("newWindow", () => {
  createWindow();
});

ipcMain.on("newWindowURL", (event, url) => {
  createWindow(true, null, url);
});

app.on("web-contents-created", (e, wc) => {
  // wc: webContents of <webview> is now under control
  wc.setWindowOpenHandler((details) => {
    return {
      action: "allow",
      overrideBrowserWindowOptions: true,
      outlivesOpener: true,
      createWindow: (options) => {
        options.webPreferences = {
          webviewTag: true,
          preload: path.join(__dirname, "preload.js"),
        };
        options.icon = iconPath;
        const win = createWindow(true, options, details.url);
        return win.webContents;
      },
    };
  });
});

//app start & close
app.on("window-all-closed", () => {
  app.quit();
});

app.whenReady().then(() => {
  const win = createWindow();

  globalShortcut.register("CommandOrControl+F5", () => {
    if (win.isFocused()) win.webContents.send("reloadPage");
  });
});

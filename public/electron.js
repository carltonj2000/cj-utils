const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");
const process = require("process");
const isDev = require("electron-is-dev");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 1040 });

let win;

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const url = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../build/index.html")}`;

const devToolExtPathMac = path.join(
  os.homedir(),
  "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0"
);
const devToolExtPathWin = path.join(
  os.homedir(),
  "/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0"
);
let devToolExtPath;

switch (process.platform) {
  case "win32":
    devToolExtPath = devToolExtPathWin;
    break;
  case "darwin":
  default:
    devToolExtPath = devToolExtPathMac;
    break;
}

function createWindow() {
  BrowserWindow.addDevToolsExtension(devToolExtPath);

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(url);

  win.on("closed", () => (win = null));

  wss.on("connection", function(w) {
    w.on("message", function(data) {
      console.log(data);
    });
    w.on("close", function() {
      console.log("Closed");
    });
    w.send("Hello interface!");
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");
const isDev = require("electron-is-dev");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 1040 });

let win;

function createWindow() {
  BrowserWindow.addDevToolsExtension(
    path.join(
      os.homedir(),
      "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0"
    )
  );

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.on("closed", () => {
    win = null;
  });

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

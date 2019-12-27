const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const os = require("os");
const process = require("process");
const isDev = require("electron-is-dev");
const WebSocket = require("ws");

const Hm = require("./handleMessages");

let win;

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const url = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../build/index.html")}`;

const devToolExtPathMac = path.join(
  os.homedir(),
  "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.1_0"
);
const devToolExtPathWin = path.join(
  os.homedir(),
  "/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.1_0"
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

const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ role: "about" }, { role: "quit" }]
        }
      ]
    : []),
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/carltonj2000/cj-utils");
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

let wss = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isDev) {
    BrowserWindow.addDevToolsExtension(devToolExtPath);
    win.webContents.openDevTools();
  }

  win.loadURL(url);

  win.on("closed", () => (win = null));

  wss = new WebSocket.Server({ port: 1040 });
  wss.on("connection", function(w) {
    w.on("message", Hm.handleMessage(w));
    w.on("close", () => console.log("Closed"));
    w.send(JSON.stringify({ cmd: "ping", id: 0, value: "Server Up." }));
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

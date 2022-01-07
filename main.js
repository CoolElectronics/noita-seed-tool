// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
var spawn = require("child_process").spawn,
  child;
const path = require("path");
const { exec } = require("child_process");
const { electron } = require("process");
const ipc = require("electron").ipcMain;
const ps = require("node-powershell");
var mainWindow;
const saves = path.join(
  process.env.APPDATA,
  "..",
  "LocalLow",
  "Nolla_Games_Noita"
);
const noitaexe =
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Noita\\noita.exe";
function opennoita() {
  console.log("opening noita " + noitaexe);
  child = spawn("powershell.exe", [__dirname + "\\noita.ps1"]);
  child.stdout.on("data", function (data) {
    console.log("Powershell Data: " + data);
  });
  child.stderr.on("data", function (data) {
    console.log("Powershell Errors: " + data);
  });
  child.on("exit", function () {
    console.log("Powershell Script finished");
  });
  child.stdin.end();
}
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  console.log(saves);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  setInterval(GetSeed, 5000);
  ipc.on("makesave", () => {
    console.log("making save");
    exec("NoiClose.exe");
    setTimeout(() => {
      exec("save.bat");

      opennoita();
    }, 5000);
  });
  ipc.on("loadsave", () => {
    console.log("loading save");
    exec("NoiClose.exe");
    setTimeout(() => {
      exec("load.bat");
      opennoita();
    }, 5000);
  });
  ipc.on("opennoita", () => {
    opennoita();
  });
  ipc.on("opensaves", () => {
    console.log("open save");
    let fpath = saves;
    var command = "";
    switch (process.platform) {
      case "darwin":
        command = "open -R " + fpath;
        break;
      case "win32":
        if (process.env.SystemRoot) {
          command = path.join(process.env.SystemRoot, "explorer.exe");
        } else {
          command = "explorer.exe";
        }
        command += " /select," + fpath;
        break;
      default:
        fpath = path.dirname(fpath);
        command = "xdg-open " + fpath;
    }
    console.log(command);
    exec(command, function (stdout) {});
  });
}
function GetSeed() {
  exec("NoiUtils.exe", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    mainWindow.webContents.executeJavaScript("app.seed = " + stdout);
    // mainWindow.webContents.executeJavaScript(
    //   "document.getElementById('SeedInput').value = " + stdout
    // );
    // mainWindow.webContents.executeJavaScript(
    //   "app.seeed(" + stdout + "," + stdout + ")"
    // );
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  app.quit();
});

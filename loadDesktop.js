'use strict';
const electron = require('electron');
var AutoUpdater = require("electron-updater");
const {dialog} = require('electron');
const {Menu} = require('electron');
var path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
var os = require('os');

const log = require("electron-log");
log.transports.file.level = "info";

var mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 730,
    nodeIntegration: false, //Disable node integration for main window for improved security
    nodeIntegrationInWorker : false, //Disable node integration for worker for improved security
    center: true,
    resizable: false,
    fullscreen : false,
    fullscreenable : false,
    title: 'Jaxx',
    frame: true,
    acceptFirstMouse: true,
    experimentalFeatures : true,
    icon: path.join(__dirname, '64.png'),
    webPreferences: {
      devTools: true,
//      sandbox: true, //Enable sandbox will actually enable drag-and-drop
      disableBlinkFeatures: 'Auxclick' //Disable middle button to open browser for improved security
    }
  });

  createMenu();
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  var ses = mainWindow.webContents.session;

  ses.clearCache(function() {
    console.log('cache cleared');
  });

  // Emitted when the window is closed.
  mainWindow.on('close', function(e) {
    e.preventDefault();

    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'Are you sure you want to quit Jaxx?'
    }, function(response) {
      if(response === 0) {
        log.info(response);
        log.info(mainWindow);
        var browserWindows = BrowserWindow.getAllWindows();
        browserWindows.forEach(function(browserWindow) {
          browserWindow.destroy();
        });
      } else {
        log.info(response);
      }
    });
  });

  //Disable drag-and-drop navigation in main window for improved security
  mainWindow.webContents.on('will-navigate', function(event) {
    event.preventDefault();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
// mainWindow.webContents.openDevTools();
}

app.on('ready', function() {
  createWindow();

  AutoUpdater.autoUpdater.logger = log;

  log.info("App starting...");

  log.info(os.type());

  AutoUpdater.autoUpdater.on('checking-for-update', function() {
    sendStatusToWindow('Checking for update...');
  });

  AutoUpdater.autoUpdater.on('update-available', function(info) {
    sendStatusToWindow('Update available.');
  });

  AutoUpdater.autoUpdater.on('update-not-available', function(info) {
    sendStatusToWindow('Update not available.');
  });

  AutoUpdater.autoUpdater.on('error', function(err) {
    sendStatusToWindow('Error in auto-updater.');
    log.info(os.type());
    log.info(os.type() === 'Linux');
    if(os.type() === 'Linux') {
      dialog.showMessageBox(mainWindow, {
        "type": "info",
        "buttons": ['OK'],
        "title": "A new update is available",
        "message": "A new version is available to download at https://jaxx.io/"
      });
    }
  });

  AutoUpdater.autoUpdater.on('download-progress', function(progressObj) {
    var log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  });

  if(!isDev) {

    AutoUpdater.autoUpdater.allowDowngrade = false;

    AutoUpdater.autoUpdater.on('update-downloaded', function(info) {
      dialog.showMessageBox(mainWindow, {
        "type": "info",
        "buttons": ['OK'],
        "title": "A new update is ready to install",
        "message": "Version " + info.version + " was downloaded and will be automatically installed on Quit"
      });
    });

    AutoUpdater.autoUpdater.checkForUpdates();
  }

});

function notify(title, message) {
  var windows = mainWindow.getAllWindows();
  if (windows.length === 0) {
    return;
  }

  windows[0].webContents.send("notify", title, message);
}

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

// app.on('window-all-closed', function() {
//     app.quit();
// });

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();

  }
});


function createMenu() {
  var template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    }
  ]; //End template for menubar

  var name = "Jaxx"
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Cmd+Q',
        click: function() {
          app.quit();
        }
      },
    ]
  });

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('window-all-closed', function() {
    app.quit();
  });


  //------------------Context menu (right click)

  const InputMenu = Menu.buildFromTemplate(
    [
      {
        label: 'Undo',
        role: 'undo',
      },
      {
        label: 'Redo',
        role: 'redo',

      },
      {
        type: 'separator',

      },
      {
        label: 'Cut',
        role: 'cut',

      },
      {
        label: 'Copy',
        role: 'copy',
      },
      {
        label: 'Paste',
        role: 'paste',
      },
      {
        type: 'separator',
      },
      {
        label: 'Select all',
        role: 'selectall'
      }
    ]
  );
}

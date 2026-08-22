const { BrowserWindow, app, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require('path');

let mainWindow = undefined;
let projectPath = undefined;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 640,
    minWidth: 900,
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
  } else {
    const distPath = path.join(__dirname, '../../dist/index.html');
    await mainWindow.loadFile(distPath);
  }
}

app.whenReady().then(() => {
  createWindow().catch(error => console.error(error));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().catch(error => console.error(error));
    }
  });

  ipcMain.handle("openDirRequest", handleOpenDir);
  ipcMain.handle("newFileRequest", handleNewFile);
  ipcMain.handle("openFileRequest", handleOpenFile);
  ipcMain.on("saveFileRequest", handleSaveFile);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function handleOpenDir() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ["openDirectory"] });

  if (canceled || filePaths.length === 0) {
    return [];
  }
  projectPath = filePaths[0];
  return getDirContent(projectPath);
}

async function handleNewFile(_event, fileName, data) {
  if (!projectPath) {
    dialog.showErrorBox("No open project", "Open or create a project folder first before creating a new file.");
    return [];
  }

  fs.writeFileSync(path.join(projectPath, fileName), data);
  return getDirContent(projectPath);
}

async function handleOpenFile(_event, fileName) {
  if (!projectPath) return null;
  const fullPath = path.join(projectPath, fileName);
  try {
    const file = await fs.promises.readFile(fullPath, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

async function handleSaveFile(_event, fileName, data) {
  if (!projectPath) {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: fileName,
      filters: [{ name: 'VisFlow Files', extensions: ['visflow'] }],
    });
    if (!canceled && filePath) {
      fs.writeFileSync(filePath, data);
    }
    return;
  }

  fs.writeFileSync(path.join(projectPath, fileName), data);
}

async function getDirContent(dir) {
  const dirList = [];
  try {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile()) {
        dirList.push({
          fileName: item.name,
          filePath: path.join(dir, item.name),
        });
      }
    }
  } catch (e) {
    console.error("Failed to read directory:", e);
  }
  return dirList;
}

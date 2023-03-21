const { BrowserWindow, app, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow = undefined;
let projectPath = undefined;

async function createWindow() {
    mainWindow = new BrowserWindow({
        minHeight: 600,
        minWidth: 800,
        autoHideMenuBar: true,
        fullscreenable: true,
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    await mainWindow.loadFile(path.join(__dirname, "../", "app", "index.html"));
}

app.whenReady().then(() => {
    createWindow().catch(error => console.error(error));

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().catch(error => console.error(error));
    }

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

    if (canceled) {
        return;
    } else {
        projectPath = filePaths[0];
    }

    return getDirContent(projectPath);
}


async function handleNewFile(event, fileName, data) {
    if (projectPath === undefined) {
        dialog.showErrorBox("No open project", "Open or create a project first before creating a new file");
        return;
    }

    fs.writeFileSync(path.join(projectPath, fileName), data);
    return getDirContent(projectPath);
}

async function handleOpenFile(event, fileName) {
    let file = await fs.promises.readFile(path.join(projectPath, fileName)).catch(error => { return console.error(error) })
    console.log("🚀 ~ file: electron.js:71 ~ handleOpenFile ~ JSON.parse(file.toString());:", JSON.parse(file.toString()))
    return JSON.parse(file.toString());
}

async function handleSaveFile(event, fileName, data) {
    if (projectPath === undefined) {
        dialog.showErrorBox("No open project", "Open or create a project first before saving");
        return;
    }

    fs.writeFileSync(path.join(projectPath, fileName), data);
}

async function getDirContent(projectPath) {
    let dirList = [];
    let items = await fs.promises.readdir(projectPath, { withFileTypes: true });
    items.forEach(item => {
        if (item.isFile()) {
            dirList.push({
                fileName: item.name,
                filePath: path.join(projectPath, item.name)
            });
        }
    });

    return dirList;
}

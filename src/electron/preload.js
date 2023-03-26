const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("VisFlow", {
    openDir: () => ipcRenderer.invoke("openDirRequest"),
    newFile: (fileName, data) => ipcRenderer.invoke("newFileRequest", fileName, data),
    openFile: (fileName) => ipcRenderer.invoke("openFileRequest", fileName),
    saveFile: (fileName, data) => ipcRenderer.send("saveFileRequest", fileName, data)
});
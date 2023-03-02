const { contextBridge, ipcRenderer } = require("electron")

//unidirecional
contextBridge.exposeInMainWorld("functions", {
	selectFolder: () => ipcRenderer.invoke("selectFolder"),
	savePath: (srcPath, dstPath) =>
		ipcRenderer.invoke("savePath", srcPath, dstPath),
	handleBackup: (srcPath, dstPath) =>
		ipcRenderer.invoke("handleBackup", srcPath, dstPath),
})

//do principal para o renderizador
contextBridge.exposeInMainWorld("electronAPI", {
	backupStatus: (callback) => ipcRenderer.on("backupStatus", callback),
	backupFinalized: (callback) => ipcRenderer.on("backupFinalized", callback),
	paths: (callback) => ipcRenderer.on("paths", callback),
})

const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("functions", {
	ping: () => ipcRenderer.invoke("ping"),
	handleBackup: (srcPath, dstPath) =>
		ipcRenderer.invoke("handleBackup", srcPath, dstPath),
	setCron: (cronTab, srcPatch, dstPath) =>
		ipcRenderer.invoke("setCron", cronTab, srcPatch, dstPath),
})

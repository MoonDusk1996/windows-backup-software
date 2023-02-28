const { ipcMain } = require("electron")
const handleBackup = require("./controllers/backup")
const setCron = require("./controllers/setCron")
const selectFolder = require("./controllers/selectFolder")

module.exports = function handleFunctions() {
	ipcMain.handle("handleBackup", handleBackup)
	ipcMain.handle("setCron", setCron)
	ipcMain.handle("selectFolder", selectFolder)
}

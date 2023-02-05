const { ipcMain } = require("electron")
const handleBackup = require("./controllers/backup")
const setCron = require("./controllers/setCron")

module.exports = function handleFunctions() {
	ipcMain.handle("handleBackup", handleBackup)
	ipcMain.handle("setCron", setCron)
}

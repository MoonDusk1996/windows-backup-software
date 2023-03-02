const { app, BrowserWindow, ipcMain } = require("electron")
const settings = require("electron-settings")
const mainWindow = require("./src/main/windows/mainWindow")
const selectFolder = require("./src/controllers/selectFolder")
const handleBackup = require("./src/controllers/handleBackup")

//Executa quando abrir a aplicação
app.whenReady().then(async () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		//carrega configurações
		const srcPath = await settings.get("srcPath").then((data) => data)
		const dstPath = await settings.get("dstPath").then((data) => data)
		const cron = await settings.get("cron").then((data) => data)

		//cria a janela e carrega as funções
		mainWindow(srcPath, dstPath, cron)
		ipcMain.handle("selectFolder", selectFolder)
		ipcMain.handle("savePath", async (e, srcPath, dstPath) => {
			await settings.set("srcPath", srcPath)
			await settings.set("dstPath", dstPath)
		})
		ipcMain.handle("handleBackup", handleBackup)
	}
})

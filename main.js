const { app, BrowserWindow, ipcMain } = require("electron")
const settings = require("electron-settings")
const mainWindow = require("./src/main/windows/mainWindow")
const selectFolder = require("./src/controllers/selectFolder")
const handleBackup = require("./src/controllers/handleBackup")

// executa quando abrir a aplicação

app.whenReady().then(async () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		// carrega configurações do usuário ou padrões
		const srcPath = (await settings.get("srcPath").then((data) => data))
			? await settings.get("srcPath").then((data) => data)
			: "C://Users/Public"

		const dstPath = (await settings.get("dstPath").then((data) => data))
			? await settings.get("dstPath").then((data) => data)
			: "C://Backup"

		const cron = (await settings.get("cron").then((data) => data))
			? await settings.get("cron").then((data) => data)
			: "0 0 * * *"

		// cria a janela e carrega as funções
		mainWindow(srcPath, dstPath, cron)
		// cria o handle para as funções
		ipcMain.handle("selectFolder", selectFolder)
		ipcMain.handle("savePath", async (e, srcPath, dstPath) => {
			await settings.set("srcPath", srcPath)
			await settings.set("dstPath", dstPath)
		})
		ipcMain.handle("handleBackup", handleBackup)
	}
})

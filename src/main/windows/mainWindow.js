const { BrowserWindow } = require("electron")
const path = require("path")
const toTray = require("../tray/toTray")

module.exports = async function createWindow(srcPath, dstPath, cron) {
	// cria a janela
	const mainWindow = new BrowserWindow({
		icon: path.join(process.cwd() + "/assets/icon.ico"),
		width: 500,
		height: 300,
		resizable: false,
		webPreferences: {
			preload: path.join(process.cwd() + "/preload.js"),
			nodeIntegration: true,
		},
	})

	// carrega o arquivo index.html
	await mainWindow.loadFile("./src/renderer/index.html")
	mainWindow.webContents.send("paths", srcPath, dstPath)

	//oculta a barra de menu padrão
	mainWindow.setMenu(null)

	// abre o DevTools.
	// mainWindow.webContents.openDevTools()

	//ação quando fechar a janela
	mainWindow.on("close", (e) => toTray(e))
}

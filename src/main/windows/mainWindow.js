const { BrowserWindow } = require("electron")
const path = require("path")
const toTray = require("../tray/toTray")

module.exports = async function createWindow(srcPath, dstPath, cron) {
	// configurações da janela
	const windowRender = {
		icon: path.join(__dirname + "/assets/icon.ico"),
		width: 500 * 3,
		height: 300 * 3,
		resizable: true,
		autoHideMenuBar: true,
		webPreferences: {
			enableRemoteModule: true,
			nodeIntegration: true,
			preload: path.join(process.cwd() + "/preload.js"),
		},
	}

	// cria a janela passando as configurações como parâmetro
	const mainWindow = new BrowserWindow(windowRender)

	// carrega o arquivo index.html
	await mainWindow.loadFile("./src/renderer/index.html")
	mainWindow.webContents.send("paths", srcPath, dstPath)

	// abre o DevTools.
	mainWindow.webContents.openDevTools()

	// minimiza para a bandeja do sistema quando sair
	mainWindow.on("close", (event) => toTray(event, srcPath, dstPath, cron))
}

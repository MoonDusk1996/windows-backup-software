const { app, BrowserWindow, Tray, Menu } = require("electron")
const path = require("path")
const handleFunctions = require("./handleFunctions")

//aplicação minimizada na bandeja do sistema
let tray = null

//cria a janela da aplicação
const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: path.join(__dirname + "/public/icon.png"),
		width: 500,
		height: 350,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	})

	// carrega o arquivo index.html
	mainWindow.loadFile("index.html")
	//oculta a barra de menu padrão
	mainWindow.setMenu(null)
	// Abre o DevTools.
	mainWindow.webContents.openDevTools()
	mainWindow.on("close", (e) => {
		if (tray === null) {
			e.preventDefault()
			mainWindow.hide()

			tray = new Tray(path.join(__dirname, "/public/icon.png"))

			tray.on("double-click", () => {
				tray.destroy()
				tray = null
				mainWindow.show()
			})

			const contextMenu = Menu.buildFromTemplate([
				{
					label: "Abrir",
					type: "normal",
					click: () => {
						tray.destroy()
						tray = null
						mainWindow.show()
					},
				},
				{
					label: "Sair",
					type: "normal",
					click: () => {
						tray.destroy()
						app.quit()
					},
				},
			])
			tray.setContextMenu(contextMenu)
		} else {
			app.quit()
		}
	})
}

app.whenReady().then(() => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
	handleFunctions()
})

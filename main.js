const { app, BrowserWindow, Tray, Menu } = require("electron")
const path = require("path")

const handleFunctions = require("./handleFunctions")

let tray = null

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: path.join(__dirname + "/public/icon.png"),
		width: 400,
		height: 300,

		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	})

	// and load the index.html of the app.
	mainWindow.loadFile("index.html")

	mainWindow.setMenu(null)

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
	mainWindow.on("close", (e) => {
		if (tray === null) {
			e.preventDefault()
			tray = new Tray(path.join(__dirname, "/public/icon.png"))
			mainWindow.hide()

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
		}
	})
}

app.whenReady().then(() => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
	handleFunctions()
})
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

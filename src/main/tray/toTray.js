const { app, BrowserWindow, Tray, Menu, Notification } = require("electron")
const path = require("path")
const settings = require("electron-settings")
const cron = require("node-cron")
const handleBackup = require("../../controllers/handleBackup")

let tray = null
let cronJob = null

;(async function teste() {
	const cronTime = await settings.get("cron").then((data) => data)
	const srcPath = await settings.get("srcPath").then((data) => data)
	const dstPath = await settings.get("dstPath").then((data) => data)
	cronJob = cron.schedule(cronTime, async () => {
		await handleBackup(null, srcPath, dstPath)
	})
})()

module.exports = async function toTray(e) {
	if (tray !== null) return
	e.preventDefault()
	const mainWindow = BrowserWindow.getAllWindows()[0]

	const cronTime = await settings.get("cron").then((data) => data)
	const srcPath = await settings.get("srcPath").then((data) => data)
	const dstPath = await settings.get("dstPath").then((data) => data)

	const setedBackupNotfication = new Notification({
		title: "Backup definido",
		body: `Backup definido para ${
			cronTime === "0 0 * * *"
				? "todos os dias"
				: cronTime === "0 0 * * 0"
				? "todas os domingos"
				: cronTime === "0 0 1 * *"
				? "todo dia 1°"
				: null
		} às 00:00`,
	})
	const trayMenu = [
		{
			label: "Backup automático",
			submenu: [
				{
					label: "Diário",
					type: "radio",
					click: async () => {
						if (cronJob !== null) {
							await cronJob.stop()
						}
						cronJob = cron.schedule("0 0 * * *", async () => {
							handleBackup(null, srcPath, dstPath)
						})

						await settings.set("cron", "0 0 * * *")
						console.log("backup definido como diario")
						setedBackupNotfication.show()
					},
				},
				{
					label: "Semanal",
					type: "radio",
					click: async () => {
						if (cronJob !== null) {
							await cronJob.stop()
						}
						cronJob = cron.schedule("0 0 * * 0", async () => {
							handleBackup(null, srcPath, dstPath)
						})

						await settings.set("cron", "0 0 * * 0")
						console.log("backup definido como semanal")
						setedBackupNotfication.show()
					},
				},
				{
					label: "Mensal",
					type: "radio",
					click: async () => {
						if (cronJob !== null) {
							await cronJob.stop()
						}
						cronJob = cron.schedule("0 0 1 * *", async () => {
							handleBackup(null, srcPath, dstPath)
						})
						await settings.set("cron", "0 0 1 * *")
						console.log("backup definido como mensal")
						setedBackupNotfication.show()
					},
				},
			],
		},
		{
			type: "separator",
		},
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
	]
	tray = new Tray(path.join(process.cwd() + "./assets/icon.png"))
	const contextMenu = Menu.buildFromTemplate(trayMenu)
	switch (cronTime) {
		case "0 0 * * *":
			contextMenu.items[0].submenu.items[0].checked = true

			break
		case "0 0 * * 0":
			contextMenu.items[0].submenu.items[1].checked = true

			break
		case "0 0 1 * *":
			contextMenu.items[0].submenu.items[2].checked = true

			break
	}

	tray.setToolTip("Simple backup")
	tray.setContextMenu(contextMenu)

	mainWindow.hide()

	tray.on("click", () => {
		tray.destroy()
		tray = null
		mainWindow.show()
	})
}

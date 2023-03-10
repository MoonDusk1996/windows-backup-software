const { app, BrowserWindow, Tray, Menu, Notification } = require("electron")
const path = require("path")
const settings = require("electron-settings")
const schedule = require("node-cron")
const handleBackup = require("../../controllers/handleBackup")

let cronJob = null
let tray = null

	; (async function cronTask() {
		const srcPath = (await settings.get("srcPath").then((data) => data))
			? await settings.get("srcPath").then((data) => data)
			: ""

		const dstPath = (await settings.get("dstPath").then((data) => data))
			? await settings.get("dstPath").then((data) => data)
			: ""

		const cron = (await settings.get("cron").then((data) => data))
			? await settings.get("cron").then((data) => data)
			: "0 0 * * *"

		return schedule.schedule(cron, async () => {
			handleBackup(null, srcPath, dstPath)
		})
	})()

module.exports = async function toTray(event, srcPath, dstPath, cron) {
	if (tray !== null) return
	event.preventDefault()
	const mainWindow = BrowserWindow.getAllWindows()[0]
	const setedBackupNotfication = new Notification({
		title: "Backup definido",
		body: `Backup definido para ${cron === "0 0 * * *"
			? "todos os dias"
			: cron === "0 0 * * 0"
				? "todas os domingos"
				: cron === "0 0 1 * *"
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
						cronJob = schedule.schedule("0 0 * * *", async () => {
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
						cronJob = schedule.schedule("0 0 * * 0", async () => {
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
						cronJob = schedule.schedule("0 0 1 * *", async () => {
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
	switch (cron) {
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

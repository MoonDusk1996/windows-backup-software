const path = require("path")
const fs = require("fs-extra")
const { BrowserWindow, Notification } = require("electron")

module.exports = async function handleBackup(e, srcPath, dstPath) {
	const mainWindow = BrowserWindow.getAllWindows()[0]

	const notificationStart = `Fazendo backup de ${srcPath} para ${dstPath}`
	const nativeNotificationStart = new Notification({
		title: "Backup iniciado",
		body: notificationStart,
	})

	const notificationEnd = "Backup concluido com sucesso"
	const nativeNotificationEnd = new Notification({
		title: "Backup finalizado",
		body: notificationEnd,
	})

	console.log(notificationStart)
	nativeNotificationStart.show()

	return new Promise(async (resolve, reject) => {
		const source = path.join(srcPath)
		const target = path.join(dstPath)
		async function copyFiles(source, target) {
			// Lista todos os arquivos e subdiretórios no diretório de origem
			const files = await fs.readdir(source)

			// Itera sobre a lista de arquivos e subdiretórios
			for (const file of files) {
				// Cria o caminho completo para o arquivo ou diretório
				const filePath = path.join(source, file)
				let fileText = filePath.split("").slice(0, 100).join("").concat("...")
				mainWindow.webContents.send(
					"backupStatus",
					`Backup em andamento: ${fileText}`
				)
				// Verifica se o arquivo é um diretório
				const isDirectory = await fs
					.stat(filePath)
					.then((stat) => stat.isDirectory())

				if (isDirectory) {
					// Se o arquivo for um diretório, chama a função recursivamente
					await copyFiles(filePath, path.join(target, file))
				} else {
					// Se o arquivo for um arquivo, copia o arquivo para o diretório de destino
					await fs.copy(filePath, path.join(target, file))
				}
			}
		}
		return copyFiles(source, target)
			.then(() => {
				console.log(notificationEnd)
				nativeNotificationEnd.show()
				resolve(notificationEnd)
				mainWindow.webContents.send("backupFinalized", notificationEnd)
			})
			.catch((err) => {
				console.log(err)
				reject(err)
				mainWindow.webContents.send("backupFinalized", err)
			})
	})
}

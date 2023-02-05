const cron = require("node-cron")
const path = require("path")
const fs = require("fs-extra")

module.exports = async function setCron(e, cronTab, srcPath, dstPath) {
	let cronConfig
	switch (cronTab) {
		case "diario":
			cronConfig = "0 0 * * *"
			break
		case "semanal":
			cronConfig = "0 0 * * 0"
			break
		case "mensal":
			cronConfig = "0 0 1 * *"
			break
		case "minuto":
			cronConfig = "* * * * *"
			break
	}
	console.log(`Cron definido como: ${cronTab}`)

	cron.schedule(cronConfig, function () {
		console.log("Processo de backup em andamento")
		const source = path.join(srcPath)
		const target = path.join(dstPath)

		const copyFile = (source, target) => {
			return fs.copy(source, target).catch((error) => {
				console.error(`Erro ao copiar o arquivo "${source}" para "${target}"`)
				console.error(error)
			})
		}

		fs.readdir(source)
			.then((files) => {
				const copyOperations = files.map((file) => {
					return copyFile(`${source}/${file}`, `${target}/${file}`)
				})
				return Promise.all(copyOperations)
			})
			.then(() => {
				console.log("Todos os arquivos foram copiados com sucesso!")
			})
	})
}

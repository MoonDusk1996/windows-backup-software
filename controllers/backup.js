const path = require("path")
const fs = require("fs-extra")

module.exports = async function handleBackup(e, srcPath, dstPath) {
	const source = path.join(srcPath)
	const target = path.join(dstPath)

	const copyFile = (source, target) => {
		return fs.copy(source, target).catch((error) => {
			console.error(`Erro ao copiar o arquivo "${source}" para "${target}"`)
			console.error(error)
		})
	}

	return fs
		.readdir(source)
		.then((files) => {
			const copyOperations = files.map((file) => {
				return copyFile(`${source}/${file}`, `${target}/${file}`)
			})
			return Promise.all(copyOperations)
		})
		.then(() => {
			return "Todos os arquivos foram copiados com sucesso!"
		})
}

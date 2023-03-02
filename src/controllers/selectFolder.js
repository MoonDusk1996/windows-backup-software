const { dialog } = require("electron")

module.exports = async function selectFolder() {
	return dialog
		.showOpenDialog({
			properties: ["openFile", "openDirectory"],
		})
		.then((result) => (result.canceled ? null : result))
		.catch((err) => {
			console.log(err)
		})
}

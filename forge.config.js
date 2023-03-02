const path = require("path")
module.exports = {
	packagerConfig: {
		icon: path.join(__dirname + "/assets/icon.png"),
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				options: {
					icon: "./src/images/icon.png",
				},
			},
		},
	],
}

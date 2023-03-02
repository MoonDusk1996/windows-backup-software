//variaveis
const srcInput = document.getElementById("srcPath") // input da fonte
const dstInput = document.getElementById("dstPath") // input do destino
const srcBtn = document.getElementById("selectBackupFolder") // botão de selecionar fonte
const dstBtn = document.getElementById("selectDestinationFolder") // botão de selecionar destino
const backupBtn = document.getElementById("backupBtn") //botão de backup
const backupStatus = document.getElementById("backupStatus") //texto de status do backup

//restaura configurações
window.electronAPI.paths((event, src, dst) => {
	srcInput.value = src
	dstInput.value = dst
})

//funções
srcBtn.addEventListener("click", async () => {
	const response = await window.functions.selectFolder()
	const folderPath = response.filePaths[0]
	srcInput.value = folderPath
	await window.functions.savePath(srcInput.value, dstInput.value)
})
dstBtn.addEventListener("click", async () => {
	const response = await window.functions.selectFolder()
	const folderPath = response.filePaths[0]
	dstInput.value = folderPath
	await window.functions.savePath(srcInput.value, dstInput.value)
})
backupBtn.addEventListener("click", async () => {
	try {
		await window.functions.handleBackup(srcInput.value, dstInput.value)
	} catch (error) {
		console.log(error)
	}
})

window.electronAPI.backupStatus((event, value) => {
	backupStatus.style.color = "#6b7188"
	backupStatus.innerText = value
	srcBtn.disabled = true
	dstBtn.disabled = true
	backupBtn.disabled = true
})
window.electronAPI.backupFinalized((event, value) => {
	backupStatus.style.color = "green"
	backupStatus.innerText = value
	srcBtn.disabled = false
	dstBtn.disabled = false
	backupBtn.disabled = false
})

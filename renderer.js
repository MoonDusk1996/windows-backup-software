//set last configs
localStorage.getItem("srcPath")
	? (document.getElementById("srcPath").value = localStorage.getItem("srcPath"))
	: null

localStorage.getItem("dstPath")
	? (document.getElementById("dstPath").value = localStorage.getItem("dstPath"))
	: null

var cronInputs = Array.from(document.getElementsByName("period"))
for (var i = 0; i < cronInputs.length; i++) {
	if (cronInputs[i].value == localStorage.getItem("cron")) {
		cronInputs[i].checked = true
	}
}

//variables
const inputs = document.getElementsByClassName("inputText")
const backupStatus = document.getElementById("backupStatus")

let srcPath
let dstPath
let cron

//functions
const saveData = document.addEventListener("input", () => {
	srcPath = document.getElementById("srcPath").value
	dstPath = document.getElementById("dstPath").value
	cron = document.querySelector('input[name="period"]:checked').value

	localStorage.setItem("srcPath", srcPath)
	localStorage.setItem("dstPath", dstPath)
	localStorage.setItem("cron", cron)
	window.functions.setCron(cron, srcPath, dstPath)
	backupStatus.innerText =
		cron === "diario"
			? "Backup definodo diariamente às 00:00"
			: cron === "semanal"
			? "Backup definodo semanalmente às 00:00 de domingo."
			: cron === "mensal"
			? "Backup definido mensalmente as 00:00 do primeiro dia de cada mês"
			: null
	backupStatus.style.color = "green"
})

const backupButton = document
	.getElementById("backupBtn")
	.addEventListener("click", async () => {
		backupStatus.innerText = "Processo de backup em andamento..."
		backupStatus.style.color = "rgb(255, 145, 0)"

		try {
			const response = await window.functions.handleBackup(srcPath, dstPath)
			backupStatus.style.color = "green"
			backupStatus.innerText = response
		} catch (e) {
			console.log("Error occurred", e)
			backupStatus.style.color = "red"
			backupStatus.innerText = e
		}
	})

const settings = require("electron-settings")
const cron = require("node-cron")
const cronConfig = require("../controllers/cronConfig")

test("nulo", () => {
	cronConfig().then((data = console.log(data)))
	const n = null
	expect(n).toBeNull()
	expect(n).toBeDefined()
	expect(n).not.toBeUndefined()
	expect(n).not.toBeTruthy()
	expect(n).toBeFalsy()
})

test("zero", () => {
	const z = 0
	expect(z).not.toBeNull()
	expect(z).toBeDefined()
	expect(z).not.toBeUndefined()
	expect(z).not.toBeTruthy()
	expect(z).toBeFalsy()
})

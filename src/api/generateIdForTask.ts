export function generateId() {
	return Date.now()
		.toString()
		.split("")
		.filter((element) => /\d/.test(element))
		.join("");
}

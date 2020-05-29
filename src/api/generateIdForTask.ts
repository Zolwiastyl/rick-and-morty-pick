export function generateIdForTask() {
	return Date()
		.split("")
		.filter((element) => /\d/.test(element))
		.join("");
}

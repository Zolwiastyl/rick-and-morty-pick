module.exports = {
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	testRegex: "(./api/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	notify: true,
	notifyMode: "always",
	types: [
		"node",
		"jest",
		"@testing-library/jest-dom",
		"@types/testing-library__cypress",
	],
};

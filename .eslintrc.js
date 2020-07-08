module.exports = {
	extends: ["react-app", "plugin:jsx-a11y/recommended"],
	plugins: ["simple-import-sort", "jsx-a11y", "react-hooks"],
	rules: {
		"simple-import-sort/sort": "error",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "error",
	},
};

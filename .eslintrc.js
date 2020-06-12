module.exports = {
	extends: ["react-app", "plugin:jsx-a11y/recommended"],
	plugins: ["simple-import-sort", "jsx-a11y"],
	rules: {
		"simple-import-sort/sort": "error",
	},
};

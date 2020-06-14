module.exports = {
	plugins: [
		require("tailwindcss"),
		require("autoprefixer"),
		require("@fullhuman/postcss-purgecss")({
			content: ["./src/**/*.html", "./src/**/*.tsx"],
			defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
		}),
	],
};

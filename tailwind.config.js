module.exports = {
	purge: ["./src/**/*.{tsx, ts}", "./src/**/*.html"],

	theme: {
		screens: {
			xs: "300px",

			sm: "360px",
			// => @media (min-width: 640px) { ... }

			md: "768px",
			// => @media (min-width: 768px) { ... }

			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }
		},
	},
	extend: {},

	variants: {
		appearance: ["group-hover", "hover"],
		backgroundColor: ["responsive", "hover", "focus", "active"],
	},
	plugins: [],
};

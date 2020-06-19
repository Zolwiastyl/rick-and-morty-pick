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
		colors: {
			gray: {
				"000": "#f9f9fa",
				"100": "#eceef0",
				"200": "#dee1e5",
				"300": "#cfd3da",
				"400": "#bec4cd",
				"500": "#acb4bf",
				"600": "#97a1af",
				"700": "#808a99",
				"800": "#656d79",
				"900": "#3b4047",
			},
			primary: {
				"000": "#f6faff",
				"100": "#e3efff",
				"200": "#cee2fe",
				"300": "#b8d5fe",
				"400": "#9fc6fe",
				"500": "#82b5fd",
				"600": "#5fa1fd",
				"700": "#3287fc",
				"800": "#276ac8",
				"900": "#173f76",
			},
			success: "#2ce23b",
			critical: "#fc4333",
		},
	},
	variants: {
		appearance: ["group-hover", "hover"],
		backgroundColor: ["responsive", "hover", "focus", "active"],
		zIndex: ["hover", "focus", "responsive"],
	},
	plugins: [],
};

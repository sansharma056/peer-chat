module.exports = {
	mode: "JIT",
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {
			backgroundColor: ["active"],
		},
	},
	plugins: [],
};

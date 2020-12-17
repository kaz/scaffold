/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		public: { url: "/", static: true },
		src: { url: "/dist" },
	},
	plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
	installOptions: {
		treeshake: true,
	},
	devOptions: {
		open: "none",
	},
	buildOptions: {
		clean: true,
	},
	experiments: {
		optimize: {
			bundle: true,
			minify: true,
		},
	},
};

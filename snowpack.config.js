/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		public: { url: "/", static: true },
		src: { url: "/dist" },
	},
	plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
	devOptions: {
		open: "none",
	},
	optimize: {
		bundle: true,
		minify: true,
		treeshake: true,
	},
};

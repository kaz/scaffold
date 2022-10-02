import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

const production = process.env.NODE_ENV === "production";

export default defineConfig({
	base: "./",
	plugins: [react(), splitVendorChunkPlugin()],
	build: {
		target: "es2015",
		chunkSizeWarningLimit: 1024,
		rollupOptions: {
			output: {
				assetFileNames: "[hash].[ext]",
				chunkFileNames: "[hash].js",
				entryFileNames: "[hash].js",
			},
		},
	},
	css: {
		postcss: {
			plugins: production
				? [require("autoprefixer")(), require("postcss-gap-properties")(), require("postcss-variable-compress")()]
				: undefined,
		},
		modules: {
			generateScopedName: production ? "[md5:contenthash:base62:4]" : undefined,
		},
	},
});

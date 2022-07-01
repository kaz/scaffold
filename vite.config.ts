import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

const production = process.env.NODE_ENV === "production";

export default defineConfig({
	base: "./",
	plugins: [react(), splitVendorChunkPlugin()],
	build: {
		target: "es2015",
		rollupOptions: {
			output: {
				assetFileNames: "assets/[hash].[ext]",
				chunkFileNames: "src/[hash].js",
				entryFileNames: "src/[hash].js",
			},
		},
	},
	css: {
		postcss: {
			plugins: production ? [require("postcss-variable-compress")()] : undefined,
		},
		modules: {
			generateScopedName: production ? "[md5:contenthash:base62:4]" : undefined,
		},
	},
});

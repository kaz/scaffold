import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				assetFileNames: "assets/[hash].[ext]",
				chunkFileNames: "src/[hash].js",
				entryFileNames: "src/[hash].js",
			},
		},
	},
	css: {
		modules: {
			generateScopedName: process.env.NODE_ENV != "development" ? "[md5:contenthash:base62:4]" : undefined,
		},
	},
});

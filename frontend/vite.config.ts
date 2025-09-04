import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { apiPattern } from "./worker/api";

export default defineConfig({
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
	build: {
		rollupOptions: {
			output: {
				assetFileNames: "[hash].[ext]",
				chunkFileNames: "[hash].js",
				entryFileNames: "[hash].js",
			},
		},
	},
	server: {
		proxy: {
			[apiPattern]: {
				target: "http://localhost:50051",
			},
		},
	},
});

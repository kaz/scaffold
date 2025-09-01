import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
			"^/trade\\.v1\\.TradeService/": {
				target: "http://localhost:50051",
			},
		},
	},
});

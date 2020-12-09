import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: Configuration = {
	entry: "./src/index.tsx",
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader?modules=global", "sass-loader"],
			},
			{
				test: /\.svg$/,
				use: "file-loader",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "public/index.html",
		}),
	],
	performance: false,
};

export default config;

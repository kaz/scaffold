declare module "*.svg" {
	const filePath: string;
	export default filePath;
}

declare module "*.scss" {
	const module: { className: string };
	export default module;
}

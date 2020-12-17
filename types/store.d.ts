import store from "../src/stores";

declare module "react-redux" {
	interface DefaultRootState extends ReturnType<typeof store.getState> {}
}

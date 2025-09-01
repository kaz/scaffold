import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("routes/layout/menu.tsx", [index("routes/_index.tsx"), route("/trade/:symbol", "routes/trade.$symbol.tsx")]),
] satisfies RouteConfig;

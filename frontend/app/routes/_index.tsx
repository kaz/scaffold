import { href, Navigate } from "react-router";

export default function () {
	return <Navigate to={href("/trade/:symbol", { symbol: "BTC" })} replace />;
}

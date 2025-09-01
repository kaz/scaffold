import { href, Link } from "react-router";

const symbols = ["BTC", "ETH"];

export default function () {
	return (
		<>
			{symbols.map(symbol => (
				<Link key={symbol} to={href("/trade/:symbol", { symbol })}>
					{symbol}
				</Link>
			))}
		</>
	);
}

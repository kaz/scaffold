import { useQuery } from "@connectrpc/connect-query";
import { TradeService } from "@scaffold/schema/gen/trade/v1/trade_pb";
import type { Route } from "./+types/trade.$symbol";

export default function ({ params: { symbol } }: Route.ComponentProps) {
	const { data } = useQuery(TradeService.method.getPrice, { symbol }, { refetchInterval: 500 });
	return (
		<>
			<p>SYMBOL: {symbol}</p>
			<p>BID: {data?.bid}</p>
			<p>ASK: {data?.ask}</p>
		</>
	);
}

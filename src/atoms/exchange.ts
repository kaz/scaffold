import { atom, selector, selectorFamily } from "recoil";

type TickerResponse = {
	[key: string]: {
		"15m": number;
		last: number;
		buy: number;
		sell: number;
		symbol: string;
	};
};

export const btcAmount = atom({
	key: "btcAmount",
	default: 0,
});

const ticker = selector({
	key: "ticker",
	get: async (): Promise<TickerResponse> => {
		const resp = await fetch("https://blockchain.info/ticker");
		if (!resp.ok) {
			throw new Error(`HTTP Error: ${resp.status}`);
		}
		const contentType = resp.headers.get("Content-Type");
		if (!contentType || !contentType.startsWith("application/json")) {
			throw new Error(`Unexpected content type: ${contentType}`);
		}
		return resp.json();
	},
});
export const exchangeRate = selectorFamily({
	key: "exchangeRate",
	get:
		(target: string) =>
		({ get }) => {
			const { last } = get(ticker)[target] || {};
			if (!last) {
				throw new Error(`no such symbol: ${target}`);
			}
			return last;
		},
});

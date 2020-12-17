import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type Rates = { [key: string]: number };
type TickerResponse = {
	[key: string]: {
		"15m": number;
		last: number;
		buy: number;
		sell: number;
		symbol: string;
	};
};

export const syncRates = createAsyncThunk(
	"exchange/syncRates",
	async (): Promise<TickerResponse> => {
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
);

const slice = createSlice({
	name: "exchange",
	initialState: {
		btcAmount: 1,
		rates: {} as Rates,
	},
	reducers: {
		updateBtcAmount: (state, { payload }: PayloadAction<number>) => {
			state.btcAmount = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(syncRates.fulfilled, (state, { payload }) => {
			state.rates = Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, v.last]));
		});
		builder.addCase(syncRates.rejected, (_, { error }) => {
			alert(`syncing rates: ${error.message}`);
		});
	},
});

export default slice;
export const { updateBtcAmount } = slice.actions;

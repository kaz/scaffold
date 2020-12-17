import React, { useState } from "react";

type Props = {
	symbol: string;
	rate: number;
};
const Component = (props: Props) => {
	const [btc, setBtc] = useState(0);
	const [fiat, setFiat] = useState(0);

	const inBtc = (amount: number) => {
		setBtc(amount);
		setFiat(amount * props.rate);
	};
	const inFiat = (amount: number) => {
		setBtc(amount / props.rate);
		setFiat(amount);
	};

	return (
		<React.Fragment>
			<input type="number" value={btc} onChange={e => inBtc(parseFloat(e.target.value))} /> BTC is{" "}
			<input type="number" value={fiat} onChange={e => inFiat(parseFloat(e.target.value))} /> {props.symbol}
		</React.Fragment>
	);
};
export default Component;

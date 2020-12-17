import React, { useState } from "react";
import styled from "@emotion/styled";
import * as mixins from "../styles/mixins";

const Label = styled.label(mixins.labelLike);
const Input = styled.input({
	border: "none",
	background: "none",
	color: "inherit",
	fontSize: "inherit",
	fontFamily: "inherit",
	appearance: "textfield",
	width: "15vw",
});

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
			<Label>
				<Input type="number" value={btc} onChange={e => inBtc(parseFloat(e.target.value))} /> BTC
			</Label>
			⇄
			<Label>
				<Input type="number" value={fiat} onChange={e => inFiat(parseFloat(e.target.value))} /> {props.symbol}
			</Label>
		</React.Fragment>
	);
};
export default Component;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../stores";
import { updateBtcAmount } from "../stores/exchange";
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
	target: string;
};
const Component = ({ target }: Props) => {
	const btc = useSelector(state => state.exchange.btcAmount);
	const rate = useSelector(state => state.exchange.rates[target]);

	const dispatch = useAppDispatch();
	const inBtc = (amount: number) => {
		dispatch(updateBtcAmount(amount));
	};
	const inFiat = (amount: number) => {
		dispatch(updateBtcAmount(amount / rate));
	};

	return (
		<React.Fragment>
			<Label>
				<Input type="number" value={btc} onChange={e => inBtc(parseFloat(e.target.value))} /> BTC
			</Label>
			⇄
			<Label>
				<Input type="number" value={btc * rate} onChange={e => inFiat(parseFloat(e.target.value))} /> {target}
			</Label>
		</React.Fragment>
	);
};
export default Component;

import styled from "@emotion/styled";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { btcAmount, exchangeRate } from "../atoms/exchange";
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
	const [btc, setBtc] = useRecoilState(btcAmount);
	const rate = useRecoilValue(exchangeRate(target));

	return (
		<React.Fragment>
			<Label>
				<Input type="number" value={btc} onChange={e => setBtc(parseFloat(e.target.value))} /> BTC
			</Label>
			⇄
			<Label>
				<Input type="number" value={btc * rate} onChange={e => setBtc(parseFloat(e.target.value) / rate)} /> {target}
			</Label>
		</React.Fragment>
	);
};
export default React.memo(Component);

import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { btcAmount, exchangeRate } from "../atoms/exchange";
import css from "./Converter.module.scss";

type Props = {
	target: string;
};
const Component = ({ target }: Props) => {
	const [btc, setBtc] = useRecoilState(btcAmount);
	const rate = useRecoilValue(exchangeRate(target));

	return (
		<React.Fragment>
			<label className={css.label}>
				<input className={css.price} type="number" value={btc} onChange={e => setBtc(parseFloat(e.target.value))} /> BTC
			</label>
			⇄
			<label className={css.label}>
				<input
					className={css.price}
					type="number"
					value={btc * rate}
					onChange={e => setBtc(parseFloat(e.target.value) / rate)}
				/>{" "}
				{target}
			</label>
		</React.Fragment>
	);
};
export default React.memo(Component);

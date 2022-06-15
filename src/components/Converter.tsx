import React, { memo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { btcAmount, exchangeRate } from "../atoms/exchange";
import css from "./Converter.module.scss";

type Props = {
	target: string;
};
const Converter = ({ target }: Props) => {
	const [btc, setBtc] = useRecoilState(btcAmount);
	const rate = useRecoilValue(exchangeRate(target));

	const applyBtcAmount = (amount: number) => {
		if (!isNaN(amount)) {
			setBtc(amount);
		}
	};

	return (
		<div>
			<label className={css.label}>
				<input
					className={css.price}
					type="text"
					value={btc.toFixed(2)}
					onChange={e => applyBtcAmount(parseFloat(e.target.value))}
				/>{" "}
				BTC
			</label>
			⇄
			<label className={css.label}>
				<input
					className={css.price}
					type="text"
					value={(btc * rate).toFixed(2)}
					onChange={e => applyBtcAmount(parseFloat(e.target.value) / rate)}
				/>{" "}
				{target}
			</label>
		</div>
	);
};

export default memo(Converter);

import React from "react";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import Clock from "../components/Clock";
import Converter from "../components/Converter";
import Logo from "../components/Logo";
import css from "./App.module.scss";

const Component = () => {
	return (
		<section className={css.component}>
			<Logo />
			<HashRouter>
				<div className={css.block}>
					<Clock />
				</div>
				<div className={css.block}>
					<Link className={css.link} to="/usd">
						BTC/USD
					</Link>{" "}
					<Link className={css.link} to="/jpy">
						BTC/JPY
					</Link>
				</div>
				<div className={css.block}>
					<React.Suspense fallback="Loading ...">
						<Routes>
							<Route path="/usd" element={<Converter target="USD" />} />
							<Route path="/jpy" element={<Converter target="JPY" />} />
						</Routes>
					</React.Suspense>
				</div>
			</HashRouter>
		</section>
	);
};
export default Component;

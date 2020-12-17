import React, { useState, useEffect } from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import Converter from "../components/Converter";
import logo from "../../public/logo.svg";
import "../App.css";

const Component = () => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	});

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<HashRouter>
					<p>
						Page has been open for <code>{count}</code> seconds.
					</p>
					<p>
						<Link className="App-link" to="/usd">
							BTC/USD
						</Link>{" "}
						<Link className="App-link" to="/jpy">
							BTC/JPY
						</Link>
					</p>
					<p>
						<Switch>
							<Route exact path="/usd">
								<Converter symbol="USD" rate={22657.39} />
							</Route>
							<Route exact path="/jpy">
								<Converter symbol="JPY" rate={2333372.15} />
							</Route>
						</Switch>
					</p>
				</HashRouter>
			</header>
		</div>
	);
};
export default Component;

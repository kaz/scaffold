import logo from "../../public/logo.svg";

import React, { useState, useEffect } from "react";
import { HashRouter, Route, Switch, Link as _Link } from "react-router-dom";
import styled from "@emotion/styled";
import * as mixins from "../styles/mixins";
import Converter from "../components/Converter";

const Container = styled.div({
	textAlign: "center",
});
const Header = styled.header({
	backgroundColor: "#282c34",
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "calc(10px + 2vmin)",
	color: "white",
});
const Logo = styled.img({
	height: "40vmin",
	pointerEvents: "none",
	"@media (prefers-reduced-motion: no-preference)": {
		"&": {
			animation: `${mixins.logoSpin} infinite 20s linear`,
		},
	},
});
const Paragraph = styled.p({
	margin: "0.4rem",
});
const Code = styled.code(mixins.labelLike);
const Link = styled(_Link)({
	color: "#61dafb",
});

const Component = () => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	});

	return (
		<Container>
			<Header>
				<Logo src={logo} alt="logo" />
				<HashRouter>
					<Paragraph>
						Page has been open for <Code>{count}</Code> seconds.
					</Paragraph>
					<Paragraph>
						<Link className="App-link" to="/usd">
							BTC/USD
						</Link>{" "}
						<Link className="App-link" to="/jpy">
							BTC/JPY
						</Link>
					</Paragraph>
					<Paragraph>
						<Switch>
							<Route exact path="/usd">
								<Converter symbol="USD" rate={22657.39} />
							</Route>
							<Route exact path="/jpy">
								<Converter symbol="JPY" rate={2333372.15} />
							</Route>
						</Switch>
					</Paragraph>
				</HashRouter>
			</Header>
		</Container>
	);
};
export default Component;

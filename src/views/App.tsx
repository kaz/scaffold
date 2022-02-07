import styled from "@emotion/styled";
import React from "react";
import { HashRouter, Link as _Link, Route, Routes } from "react-router-dom";
import Clock from "../components/Clock";
import Converter from "../components/Converter";
import Logo from "../components/Logo";

const Container = styled.div({
	textAlign: "center",
	backgroundColor: "#282c34",
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "calc(10px + 2vmin)",
	color: "white",
});
const Paragraph = styled.p({
	margin: "0.5rem",
});
const Link = styled(_Link)({
	color: "#61dafb",
});

const Component = () => {
	return (
		<Container>
			<Logo />
			<HashRouter>
				<Paragraph>
					<Clock />
				</Paragraph>
				<Paragraph>
					<Link to="/usd">BTC/USD</Link> <Link to="/jpy">BTC/JPY</Link>
				</Paragraph>
				<Paragraph>
					<React.Suspense fallback="Loading ...">
						<Routes>
							<Route path="/usd" element={<Converter target="USD" />} />
							<Route path="/jpy" element={<Converter target="JPY" />} />
						</Routes>
					</React.Suspense>
				</Paragraph>
			</HashRouter>
		</Container>
	);
};
export default Component;

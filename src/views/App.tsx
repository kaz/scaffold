import styled from "@emotion/styled";
import React from "react";
import { HashRouter, Link as _Link, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Clock from "../components/Clock";
import Converter from "../components/Converter";
import Logo from "../components/Logo";

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
const Paragraph = styled.p({
	margin: "0.4rem",
});
const Link = styled(_Link)({
	color: "#61dafb",
});

const Component = () => {
	return (
		<Container>
			<Header>
				<Logo />
				<HashRouter>
					<Paragraph>
						<Clock />
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
						<RecoilRoot>
							<React.Suspense fallback="Loading ...">
								<Routes>
									<Route path="/usd" element={<Converter target="USD" />} />
									<Route path="/jpy" element={<Converter target="JPY" />} />
								</Routes>
							</React.Suspense>
						</RecoilRoot>
					</Paragraph>
				</HashRouter>
			</Header>
		</Container>
	);
};
export default Component;

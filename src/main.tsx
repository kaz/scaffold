import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./styles/global.scss";
import App from "./views/App";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("No root element found");
}

const root = createRoot(rootElement);
root.render(
	<React.StrictMode>
		<RecoilRoot>
			<App />
		</RecoilRoot>
	</React.StrictMode>,
);

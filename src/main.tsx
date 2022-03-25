import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./styles/global.scss";
import App from "./views/App";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<App />
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById("root"),
);

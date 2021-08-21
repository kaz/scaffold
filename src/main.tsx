import React from "react";
import ReactDOM from "react-dom";
import GlobalStyle from "./styles/index";
import App from "./views/App";

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<App />
	</React.StrictMode>,
	document.getElementById("root"),
);

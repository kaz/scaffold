import React from "react";
import ReactDOM from "react-dom";
import App from "./views/App";
import GlobalStyle from "./styles/index";

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<App />
	</React.StrictMode>,
	document.getElementById("root"),
);

if (import.meta.hot) {
	import.meta.hot.accept();
}

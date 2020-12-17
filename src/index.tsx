import React from "react";
import ReactDOM from "react-dom";
import store from "./stores";
import { syncRates } from "./stores/exchange";
import App from "./views/App";
import GlobalStyle from "./styles/index";
import { Provider } from "react-redux";

store.dispatch(syncRates());

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root"),
);

if (import.meta.hot) {
	import.meta.hot.accept();
}

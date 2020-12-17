import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./stores";
import { syncRates } from "./stores/exchange";
import GlobalStyle from "./styles/index";
import App from "./views/App";

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

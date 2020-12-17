import exchange from "./exchange";

import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const reducer = combineReducers({
	[exchange.name]: exchange.reducer,
});
const store = configureStore({ reducer });

export default store;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

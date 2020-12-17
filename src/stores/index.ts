import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";
import exchange from "./exchange";

const reducer = combineReducers({
	[exchange.name]: exchange.reducer,
});
const store = configureStore({ reducer });

export default store;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

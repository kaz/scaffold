import React from "react";
import logo from "../../assets/logo.svg";
import css from "./Logo.module.scss";

const Component = () => {
	return <img className={css.logo} src={logo} />;
};
export default Component;

import React, { memo } from "react";
import logo from "../../assets/logo.svg";
import css from "./Logo.module.scss";

const Logo = () => {
	return <img className={css.logo} src={logo} />;
};

export default memo(Logo);

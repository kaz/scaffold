import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import logo from "../../public/logo.svg";

const logoSpin = keyframes({
	from: {
		transform: "rotate(0deg)",
	},
	to: {
		transform: "rotate(360deg)",
	},
});
const Logo = styled.img({
	height: "40vmin",
	pointerEvents: "none",
	"@media (prefers-reduced-motion: no-preference)": {
		"&": {
			animation: `${logoSpin} infinite 20s linear`,
		},
	},
});

const Component = () => {
	return <Logo src={logo} alt="logo" />;
};
export default Component;

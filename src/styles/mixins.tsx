import { css, keyframes } from "@emotion/react";

export const logoSpin = keyframes({
	from: {
		transform: "rotate(0deg)",
	},
	to: {
		transform: "rotate(360deg)",
	},
});
export const labelLike = css({
	background: "#fff3",
	padding: "4px 8px",
	borderRadius: "4px",
	fontFamily: `source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace`,
});

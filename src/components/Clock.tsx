import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import * as mixins from "../styles/mixins";

const Code = styled.code(mixins.labelLike);

const Component = () => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	});

	return (
		<React.Fragment>
			Page has been open for <Code>{count}</Code> seconds.
		</React.Fragment>
	);
};
export default Component;

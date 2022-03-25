import React, { useEffect, useState } from "react";
import css from "./Clock.module.scss";

const Component = () => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	});

	return (
		<React.Fragment>
			Page has been open for <code className={css.time}>{count}</code> seconds.
		</React.Fragment>
	);
};
export default Component;

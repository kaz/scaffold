import React, { memo, useEffect, useState } from "react";
import css from "./Clock.module.scss";

const Clock = () => {
	const [elapsed, setElapsed] = useState(0);
	useEffect(() => {
		const start = Date.now();
		const timer = setInterval(() => setElapsed(Date.now() - start), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<span>
			Page has been open for <code className={css.time}>{Math.round(elapsed / 1000)}</code> seconds.
		</span>
	);
};

export default memo(Clock);

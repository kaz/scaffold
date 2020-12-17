import React, { useState, useEffect } from "react";
import logo from "../../public/logo.svg";
import "../App.css";

const Component = () => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	});

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<p>
					Page has been open for <code>{count}</code> seconds.
				</p>
				<p>
					<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
						Learn React
					</a>
				</p>
			</header>
		</div>
	);
};
export default Component;

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
	const [count, setCount] = useState(0);
	const [data, setData] = useState(null);

	axios
		.get(import.meta.env.VITE_BACKEND_URL + "/health")
		.then((response) => {
			setData(response.data);
		})
		.catch((error) => {
			console.error("Error fetching health data:", error);
		});

	return (
		<>
			<div className="flex">
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<h2 className="text-xl font-semibold">
				Backend Health Status : {data ? data?.message : "Loading..."}
			</h2>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;

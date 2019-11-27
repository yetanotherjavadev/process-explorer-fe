import React from "react";
import "./App.css";
import Main from "./components/main/Main";

const App: React.FC = () => {
	return (
		<div className="App">
			<header className="App-header">
				<Main/>
			</header>
		</div>
	);
};

export default App;

import React from "react";
import MainComponent from "./components/main/MainComponent";
import "./App.css";

const App: React.FC = () => {
	return (
		<div className="App">
			<header className="App-header">
				<MainComponent/>
			</header>
		</div>
	);
};

export default App;

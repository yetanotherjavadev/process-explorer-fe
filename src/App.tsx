import React from "react";
import "./App.css";
import { ProcessTable } from "./components/table/ProcessTable";
import { Process } from "./types/Process";

const processesMock = require("./mockdata/processes.json"); // TODO: add type checking

const processes: Array<Process> = processesMock;

const App: React.FC = () => {
	return (
		<div className="App">
			<header className="App-header">
				<ProcessTable processes={processes}/>
			</header>
		</div>
	);
};

export default App;

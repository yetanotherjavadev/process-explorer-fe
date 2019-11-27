import * as React from "react";
import { Component } from "react";
import ChildComponent from "../child/ChildComponent";

interface MainProps {
}

interface MainState {
	dataFromServer: string;
}

class Main extends Component<MainProps, MainState> {

	constructor(props: MainProps) {
		super(props);
		this.state = {
			dataFromServer: "",
		};
	}

	render() {
		return (<ChildComponent/>);
	}
}

export default Main;
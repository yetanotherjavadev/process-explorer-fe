import * as React from "react";
import { Component } from "react";
import ChildComponent from "../child/ChildComponent";

interface MainProps {

}

interface MainState {
	dataFromServer: string;
}

class Main extends Component<MainProps, MainState> {

	// instance of websocket connection as a class property
	ws = new WebSocket("ws://localhost:8080/pe-websocket/websocket");

	constructor(props: MainProps) {
		super(props);
		this.state = {
			dataFromServer: "",
		};
	}

	componentDidMount() {
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			window.console.log("connected");
		};

		this.ws.onmessage = evt => {
			const message = JSON.parse(evt.data);
			this.setState({ dataFromServer: message });
			window.console.log(message);
		};

		this.ws.onclose = () => {
			window.console.log("disconnected");
			// TODO: automatically try to reconnect on connection loss
		};

	}

	render() {
		return (<ChildComponent websocket={this.ws} />);
	}
}

export default Main;
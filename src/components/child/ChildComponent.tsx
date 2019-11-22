import * as React from "react";
import { Component } from "react";

interface CompProps {
	websocket: WebSocket;
}

class ChildComponent extends Component<CompProps> {

	sendMessage = () => {
		const { websocket } = this.props; // websocket instance passed as props to the child component.

		try {
			websocket.send("whatever at " + Date.now()); // send data to the server
		} catch (error) {
			window.console.log(error); // catch error
		}
	};

	render() {
		return (
			<div>
				<button onClick={this.sendMessage}>Send message</button>
			</div>
		);
	}
}

export default ChildComponent;
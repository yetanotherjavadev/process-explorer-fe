import * as React from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { Component } from "react";
import { Constants } from "../Constants";
import { Process } from "../../types/Process";
import { ProcessTable } from "../table/ProcessTable";
import { ChartComponent } from "../chart/ChartComponent";
import Button from "react-bootstrap/Button";

import "./MainComponent.css"; // TODO: extract styles imports to a separate file

interface MainComponentProps {}

interface MainComponentState {
	processes: Array<Process>;
	filter?: string;
	sortingBy?: string;
}

class MainComponent extends Component<MainComponentProps, MainComponentState> {
	private client: any; // TODO: add typing
	private pollingActive = false;
	private renderRef: any;

	constructor(props: MainComponentProps) {
		super(props);
		this.state = {
			processes: [],
		};
	}

	componentDidMount() {
		this.client = new Client();

		this.client.configure({
			brokerURL: Constants.DEFAULT_SERVER_ADDRESS,
			onConnect: () => {
				window.console.log("onConnect");

				this.client.subscribe("/topic/processes", (message: IMessage) => {
					// window.console.log(message.body);
					this.setState({processes: JSON.parse(message.body)});
				});

				this.client.subscribe("/topic/kill-successful", (message: IMessage) => {
					window.console.log("killed process: " + message.body);
				});

				this.client.subscribe("/topic/kill-failed", (message: IMessage) => {
					window.console.log("kill of process failed: " + message.body);
				});

				this.client.subscribe("/topic/scheduled-task-process", (message: IMessage) => {
					window.console.log(message.body); // every second data comes from server
				});
			},
			onDisconnect: () => {
				window.console.log("onDisconnect");
			}
		});

		this.client.activate();
	}

	tryToReconnect = () => {
		// try to reconnect here in case if server is down or websocket is not connected
	};

	getProcesses = () => {
		this.client.publish({destination: "/app/get-processes", body: "Give me all processes"});
	};

	startPolling = () => {
		if (!this.pollingActive) {
			this.client.publish({destination: "/app/start-process-polling", body: "Start polling please!"});
			this.pollingActive = true;
		}
	};

	stopPolling = () => {
		if (this.pollingActive) {
			this.client.publish({destination: "/app/stop-process-polling", body: "Stop polling please!"});
			this.pollingActive = false;
		}
	};

	killProcess = (pid: string) => {
		if (pid) {
			this.client.publish({destination: "/app/kill-process/" + pid, body: pid });
		}
	};

	render() {
		return (
			<div className="MainComponent">
				<div className="button-block">
					<Button variant="dark" onClick={this.tryToReconnect}>Reconnect</Button>
					<Button variant="dark" onClick={this.getProcesses}>Get Processes once</Button>
					<Button variant="dark" onClick={this.startPolling}>Start polling</Button>
					<Button variant="dark" onClick={this.stopPolling}>Stop polling</Button>
				</div>
				<div className="info-block">
					<ProcessTable processes={this.state.processes} actions={{killProcess: (pid: string) => this.killProcess(pid)}}/>
					{/*<div id="one-two-three" ref={this.renderRef}/>*/}
					<ChartComponent processes={this.state.processes}/>
				</div>

			</div>
		);
	}
}

export default MainComponent;
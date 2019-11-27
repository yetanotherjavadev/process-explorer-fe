import * as React from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { Component } from "react";
import { Constants } from "../Constants";
import { Process } from "../../types/Process";
import { ProcessTable } from "../table/ProcessTable";

interface CompProps {
}

interface ChildState {
	serverTime: string;
	processes: Array<Process>;
}

class ChildComponent extends Component<CompProps, ChildState> {
	client: any;
	private num = 0;
	private processCall = 0;
	private pollingStarted = false;

	constructor(props: CompProps) {
		super(props);
		this.state = {
			serverTime: "",
			processes: [],
		};
	}

	componentDidMount() {
		this.client = new Client();

		this.client.configure({
			brokerURL: Constants.DEFAULT_SERVER_ADDRESS,
			onConnect: () => {
				window.console.log("onConnect");

				this.client.subscribe("/queue/now", (message: IMessage) => {
					this.setState({serverTime: message.body});
				});

				this.client.subscribe("/topic/processes", (message: IMessage) => {
					window.console.log(message.body);
					this.setState({processes: JSON.parse(message.body)});
				});

				this.client.subscribe("/topic/greetings", (message: IMessage) => {
					window.console.log(message.body);
				});

				this.client.subscribe("/topic/scheduled-task-process", (message: IMessage) => {
					window.console.log(message.body); // every second data comes from server
				});
			},
		});

		this.client.activate();
	}

	clickHandler = () => {
		this.client.publish({destination: "/app/greetings", body: "Hello world " + this.num++});
	};

	getProcesses = () => {
		this.client.publish({destination: "/app/get-processes", body: "Give me processes for the time #: " + this.processCall++});
	};

	startPolling = () => {
		if (!this.pollingStarted) {
			this.client.publish({destination: "/app/start-process-polling", body: "Start polling please!"});
			this.pollingStarted = true;
		}
	};

	stopPolling = () => {
		if (this.pollingStarted) {
			this.client.publish({destination: "/app/stop-process-polling", body: "Stop polling please!"});
			this.pollingStarted = false;
		}
	};

	render() {
		return (
			<div>
				<div>
					<button onClick={this.clickHandler}>Send message</button>
					<button onClick={this.getProcesses}>Get Processes once</button>
					<button onClick={this.startPolling}>Start polling</button>
					<button onClick={this.stopPolling}>Stop polling</button>
				</div>
				<ProcessTable processes={this.state.processes}/>
			</div>
		);
	}
}

export default ChildComponent;
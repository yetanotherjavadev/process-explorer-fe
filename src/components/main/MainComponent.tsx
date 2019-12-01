import * as React from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { Component } from "react";
import { Constants } from "../Constants";
import { Process } from "../../types/Process";
import { ProcessTable } from "../table/ProcessTable";
import { ChartComponent } from "../chart/ChartComponent";
import Button from "react-bootstrap/Button";

import "./MainComponent.css";
import { SortingUtils } from "../../utils/SortingUtils";
import { SortingDescriptor } from "../../types/SortingDescriptor";
import { ProcessesBatch } from "../../types/ProcessesBatch";

interface MainComponentProps {}

interface MainComponentState {
	processesBatch: ProcessesBatch;
	filter?: string; // filter is optional and case insensitive
	sortedBy?: SortingDescriptor;
}

class MainComponent extends Component<MainComponentProps, MainComponentState> {
	private client: any; // TODO: add typing
	private pollingActive = true;

	constructor(props: MainComponentProps) {
		super(props);
		this.state = {
			processesBatch: {
				currentTime: Date.now(),
				processes: [],
			},
		};
	}

	componentDidMount() {
		this.client = new Client();

		this.client.configure({
			brokerURL: Constants.DEFAULT_SERVER_ADDRESS,
			reconnectDelay: Constants.RECONNECT_DELAY,
			onConnect: () => {
				window.console.log("onConnect");

				this.client.subscribe("/topic/processes", (message: IMessage) => {
					// window.console.log(message.body);
					this.setState({processesBatch: JSON.parse(message.body)});
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

	startPolling = () => {
		this.client.publish({ destination: "/app/start-process-polling", body: "Start polling please!" });
		this.pollingActive = true;
	};

	stopPolling = () => {
		this.client.publish({ destination: "/app/stop-process-polling", body: "Stop polling please!" });
		this.pollingActive = false;
	};

	killProcess = (pid: string) => {
		if (pid) {
			this.client.publish({destination: "/app/kill-process/" + pid, body: pid });
		}
	};

	sortByKey = (sortingDescriptor: SortingDescriptor) => {
		if (sortingDescriptor) {
			this.setState({
				sortedBy: sortingDescriptor,
			});
		}
	};

	handleFilterChange = (e: any) => {
		this.setState({
			filter: e.target.value
		});
	};

	getFilteredAndSortedProcesses = (): Array<Process> => {
		const { filter, sortedBy, processesBatch: { processes } } = this.state;
		let result = processes;
		if (filter && filter.length > 0) {
			result = processes.filter((p: Process) => {
				return p.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
			});
		}
		if (sortedBy) {
			SortingUtils.sortByKey(result, sortedBy); // in-place sorting
		}
		return result;
	};

	render() {
		return (
			<div className="MainComponent">
				<div className="title">Process explorer</div>
				<div className="button-block">
					<Button variant="dark" onClick={this.startPolling}>Start polling</Button>
					<Button variant="dark" onClick={this.stopPolling}>Stop polling</Button>
				</div>
				<div className="filter-block">
					<div className="form-group">
						<label className="inline-label" htmlFor="filter">Filter:</label>
						<input
							type="text"
							className="form-control bg-dark"
							id="filter"
							value={this.state.filter}
							onChange={this.handleFilterChange}
						/>
					</div>
				</div>
				<div className="info-block">
					<ProcessTable
						processes={this.getFilteredAndSortedProcesses()}
						sortedBy={this.state.sortedBy}
						actions={{
							killProcess: (pid: string) => this.killProcess(pid),
							sortByColumn: (sortingDescriptor: SortingDescriptor) => this.sortByKey(sortingDescriptor),
							}
						}
					/>
					<ChartComponent
						processesBatch={this.state.processesBatch}
						pollingActive={this.pollingActive}
					/>
				</div>
			</div>
		);
	}
}

export default MainComponent;
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
import { SystemInfo } from "../../types/SystemInfo";

interface MainComponentProps {}

interface MainComponentState {
	systemInfo: SystemInfo;
	filter?: string; // filter is optional and case insensitive
	sortedBy?: SortingDescriptor;
}

class MainComponent extends Component<MainComponentProps, MainComponentState> {
	private client: any; // TODO: add typing
	private pollingActive = true;

	constructor(props: MainComponentProps) {
		super(props);
		this.state = {
			systemInfo: {
				currentTime: Date.now(),
				trackedProcesses: [],
				uiProcesses: [],
				overallCpuUsage: 0.0,
			},
			filter: "",
			sortedBy: {
				key: "pid",
				asc: true,
			}
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
					this.setState({systemInfo: JSON.parse(message.body)});
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

				this.startPolling(); // automatically start polling when connected
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
		const { filter, sortedBy, systemInfo: { trackedProcesses } } = this.state;
		let result = trackedProcesses;
		if (filter && filter.length > 0) {
			result = trackedProcesses.filter((p: Process) => {
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
				<div className="info-block"/>
				<div className="data-block">
					<div className="table-block">
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
						<ProcessTable
							processes={this.getFilteredAndSortedProcesses()}
							sortedBy={this.state.sortedBy}
							actions={{
								killProcess: (pid: string) => this.killProcess(pid),
								sortByColumn: (sortingDescriptor: SortingDescriptor) => this.sortByKey(sortingDescriptor),
							}
							}
						/>
					</div>
					<div className="chart-block">
						<ChartComponent
							systemInfo={this.state.systemInfo}
							pollingActive={this.pollingActive}
							actions={{
								startPolling: () => this.startPolling(),
								stopPolling: () => this.stopPolling(),
							}}
						/>
					</div>
				</div>
				<footer className="main-footer"/>
			</div>
		);
	}
}

export default MainComponent;
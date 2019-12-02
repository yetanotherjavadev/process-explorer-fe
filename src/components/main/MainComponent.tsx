import * as React from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { Component } from "react";
import { Constants } from "../Constants";
import { Process } from "../../types/Process";
import { ProcessTable } from "../table/ProcessTable";
import { ChartComponent } from "../chart/ChartComponent";

import "./MainComponent.css";
import { SortingUtils } from "../../utils/SortingUtils";
import { SortingDescriptor } from "../../types/SortingDescriptor";
import { SystemInfo } from "../../types/SystemInfo";
import { KilledProcessInfo } from "../../types/KilledProcessInfo";

interface MainComponentProps {}

interface MainComponentState {
	systemInfo: SystemInfo;
	filter?: string; // filter is optional and case insensitive
	sortedBy?: SortingDescriptor;
	pollingActive: boolean;
	processKilled?: KilledProcessInfo;
}

class MainComponent extends Component<MainComponentProps, MainComponentState> {
	private client: Client;

	constructor(props: MainComponentProps) {
		super(props);
		this.client = new Client();
		this.state = {
			pollingActive: true,
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

	// keeping server side communication logic here for simplicity. Ultimately this should go to a separate layer
	componentDidMount() {
		this.client.configure({
			brokerURL: Constants.DEFAULT_SERVER_ADDRESS,
			reconnectDelay: Constants.RECONNECT_DELAY,
			onConnect: () => {
				window.console.log("onConnect");

				this.client.subscribe("/topic/processes", (message: IMessage) => {
					this.setState({systemInfo: JSON.parse(message.body)});
				});

				this.client!.subscribe("/topic/kill-successful", (message: IMessage) => {
					const killedProcessInfo = JSON.parse(message.body);
					window.console.log("Kill process succeeded: " + killedProcessInfo.killedId + "; New UI tracked process: " + killedProcessInfo.newProcessId);
					this.showKilledInfo(killedProcessInfo);
				});

				this.client.subscribe("/topic/kill-failed", (message: IMessage) => {
					const killedProcessInfo = JSON.parse(message.body);
					window.console.log("kill of process failed: " + killedProcessInfo.newProcessId);
					this.showKilledInfo(killedProcessInfo);
				});

				this.client.subscribe("/topic/scheduled-task-process", (message: IMessage) => {
					window.console.log(message.body); // every second data comes from server
				});

				this.startPolling(); // automatically starts polling when connected
			},
			onDisconnect: () => {
				this.setState({
					pollingActive: false,
				});
				window.console.log("onDisconnect");
			},
			onWebSocketError: () => {
				window.console.log("WebSocket error");
				this.setState({
					pollingActive: false,
				});
			},
		});
		this.client.activate();
	}

	showKilledInfo = (kpi: KilledProcessInfo) => {
		this.setState({
			processKilled: kpi,
		}, () => {
			setTimeout(() => {
				this.setState({
					processKilled: undefined,
				});
			}, Constants.MESSAGE_POPUP_TIMEOUT);
		});
	};

	startPolling = () => {
		this.client.publish({ destination: "/app/start-process-polling", body: "Start polling please!" });
		this.setState({
			pollingActive: true,
		});
	};

	stopPolling = () => {
		this.client.publish({ destination: "/app/stop-process-polling", body: "Stop polling please!" });
		this.setState({
			pollingActive: false,
		});
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
		const { filter, processKilled, sortedBy, pollingActive } = this.state;
		return (
			<div className="MainComponent">
				<div className="title">Process explorer</div>

				<div className="data-block">
					<div className="table-block">
						<div className="filter-block">
							<div className="form-group">
								<label className="inline-label" htmlFor="filter">Search by name:</label>
								<input
									type="text"
									className="form-control bg-dark"
									id="filter"
									value={filter}
									onChange={this.handleFilterChange}
								/>
							</div>
							<div className="info-block">
								{!pollingActive &&
								<div className="offline-message" role="alert">
									You're in offline mode
								</div>}
								{processKilled && processKilled.killedId &&
								<div className="info-message">
									{`Process ${processKilled.killedId} has been killed`}
								</div>}
								{processKilled && !processKilled.killedId && processKilled.newProcessId &&
								<div className="info-message">
									{`Process ${processKilled.newProcessId} cannot be killed`}
								</div>}
							</div>
						</div>
						<ProcessTable
							processes={this.getFilteredAndSortedProcesses()}
							sortedBy={sortedBy}
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
							pollingActive={this.state.pollingActive}
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
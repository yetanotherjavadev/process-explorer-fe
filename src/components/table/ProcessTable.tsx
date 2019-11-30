import React, { Component } from "react";
import "./ProcessTable.css";
import { Process } from "../../types/Process";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { SortingDescriptor } from "../../types/SortingDescriptor";

export interface ProcessTableStateProps {
	processes: Array<Process>;
	sortedBy?: SortingDescriptor;
}

export interface ProcessTableActionProps {
	actions: {
		killProcess: (processId: string) => void;
		sortByColumn: (descriptor: SortingDescriptor) => void;
	};
}

export interface ProcessTableState {
	columns: Array<keyof Process>;
}

export type ProcessTableProps = ProcessTableStateProps & ProcessTableActionProps;

/**
 * Configuration to match Process object fields to Column names
 */
const COLUMN_NAMES_MAP: Record<Partial<keyof Process>, string> = {
	"pid": "PID",
	"time": "Execution time",
	"name": "Name",
	"physicalMemory": "Physical Memory",
	"virtualMemory": "Virtual Memory",
	"executionPath": "Path",
	"cpuPercentage": "CPU %",
	"creationDate": "Creation Date",
};

const DEFAULT_COLUMN_SET: Array<keyof Process> = ["pid", "name", "cpuPercentage", "physicalMemory", "time"];

export class ProcessTable extends Component<ProcessTableProps, ProcessTableState> {

	constructor(props: ProcessTableProps) {
		super(props);
		this.state = {
			columns: DEFAULT_COLUMN_SET,
		};
	}

	renderHead = () => {
		const { columns } = this.state;
		const { sortedBy } = this.props;
		const isAsc = sortedBy && sortedBy.asc;
		return (
			<thead>
			<tr>
				{columns && columns.map((key: keyof Process) => {
					const activeKey = (sortedBy && key === sortedBy.key);
					return (
						<th key={key} className="relative-th">{COLUMN_NAMES_MAP[key]}
							<span
								className={"arrow-up" + (activeKey && !isAsc ? " active" : "")}
								onClick={(e: any) => this.props.actions.sortByColumn({ key, asc: false })}
							/>
							<span
								className={"arrow-down" + (activeKey && isAsc ? " active" : "")}
								onClick={(e: any) => this.props.actions.sortByColumn({ key, asc: true })}
							/>
						</th>
					);
				})}
				<th>Control</th>
			</tr>
			</thead>
		);
	};

	renderBody = (processes: Array<Process>) => {
		return (
			<tbody>
			{processes.map((process: Process) => {
				return (
					<tr key={process.pid}>
						{this.state.columns.map((key: keyof Process) => {
							return (
								<td key={key}>{process[key]}</td>
							);
						})}
						<td><Button className="kill-btn btn-sm" variant="dark" onClick={(e: any) => this.props.actions.killProcess(process.pid)}>Kill process</Button></td>
					</tr>
				);
			})
			}
			</tbody>
		);
	};

	render() {
		const { processes } = this.props;
		return (
			<div className="process-table-container">
				<Table className="table-full-height" striped bordered hover variant="dark">
					{this.renderHead()}
					{this.renderBody(processes)}
				</Table>
			</div>
		);
	}
}
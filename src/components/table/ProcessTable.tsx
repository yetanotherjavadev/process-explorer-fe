import React, { Component } from "react";
import "./ProcessTable.css";
import { Process } from "../../types/Process";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export interface ProcessTableStateProps {
	processes: Array<Process>;
}

export interface ProcessTableActionProps {
	actions: {
		killProcess: (processId: string) => void;
	};
}

export interface ProcessTableState {
	columns: Array<string>; // current columns to display
}

export type ProcessTableProps = ProcessTableStateProps & ProcessTableActionProps;

const DEFAULT_COLUMN_SET = ["pid", "process name", "cpu percentage", "creation date"];

export class ProcessTable extends Component<ProcessTableProps, ProcessTableState> {

	constructor(props: ProcessTableProps) {
		super(props);
		this.state = {
			columns: [],
		};
	}

	// TODO: make columns configurable
	renderHead = (columns: Array<string> = DEFAULT_COLUMN_SET) => {
		return (
			<thead>
			<tr>
				<th>PID</th>
				<th>Process Name</th>
				<th>CPU Percentage</th>
				<th>Creation Date</th>
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
						<td>{process.pid}</td>
						<td>{process.name}</td>
						<td>{process.cpuPercentage}</td>
						<td>{process.creationDate}</td>
						<td><Button variant="dark" onClick={(e: any) => this.props.actions.killProcess(process.pid)}>Kill process</Button></td>
					</tr>
				);
			})
			}
			</tbody>
		);
	};

	render() {
		const { processes } = this.props;
		const { columns } = this.state;

		return (
			<div className="process-table-container">
				<Table striped bordered hover variant="dark">
					{this.renderHead(columns)}
					{this.renderBody(processes)}
				</Table>
			</div>
		);
	}
}
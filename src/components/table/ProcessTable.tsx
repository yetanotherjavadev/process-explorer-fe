import React, { Component } from "react";
import "./ProcessTable.css";
import { Process } from "../../types/Process";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { SortingDescriptor } from "../../types/SortingDescriptor";
import { chartTheme } from "../chart/theme/ChartTheme";
import { ColumnDescriptor } from "../../types/ColumnDescriptor";
import { Constants } from "../Constants";
import { act } from "react-dom/test-utils";

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

const DEFAULT_COLUMN_SET: Array<keyof Process> = ["pid", "name", "cpuPercentage", "physicalMemory", "time"];

export class ProcessTable extends Component<ProcessTableProps, ProcessTableState> {

	constructor(props: ProcessTableProps) {
		super(props);
		this.state = {
			columns: DEFAULT_COLUMN_SET,
		};
	}

	renderSortingArrows = (key: keyof Process, activeKey: boolean, isAsc: boolean) => {
		return (
			<>
				<span
					className={"arrow-up" + (activeKey && !isAsc ? " active" : "")}
					onClick={(e: any) => this.props.actions.sortByColumn({ key, asc: false })}
				/>
				<span
					className={"arrow-down" + (activeKey && isAsc ? " active" : "")}
					onClick={(e: any) => this.props.actions.sortByColumn({ key, asc: true })}
				/>
			</>
		);
	};

	renderHead = () => {
		const { columns } = this.state;
		const { sortedBy } = this.props;
		const isAsc = !!(sortedBy && sortedBy.asc);
		return (
			<thead>
			<tr>
				<th className="color-badge"/>
				{columns && columns.map((key: keyof Process) => {
					const activeKey = !!(sortedBy && key === sortedBy.key);
					const { columnName, sortable } = Constants.COLUMN_DESCRIPTORS[key];
					return (
						<th key={key} className="relative-th">{columnName}
							{sortable && this.renderSortingArrows(key, activeKey, isAsc)}
						</th>
					);
				})}
				<th>Control</th>
			</tr>
			</thead>
		);
	};

	/**
	 * Finds a color of series in chart that matches given process ID
	 */
	getColorForProcess = (pid: string): string => {
		// chartTheme.colors; TODO: find matching
		return "#ff00ff";
	};

	renderBody = (processes: Array<Process>) => {
		return (
			<tbody>
			{processes.map((process: Process) => {
				const colorFor = this.getColorForProcess(process.pid);
				return (
					<tr key={process.pid}>
						<td className="color-badge">
							<div className="color-marker" style={{backgroundColor: colorFor}}/>
						</td>
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
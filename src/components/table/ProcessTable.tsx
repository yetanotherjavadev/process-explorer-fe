import React, { Component } from "react";
import "./ProcessTable.css";
import { Process } from "../../types/Process";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { SortingDescriptor } from "../../types/SortingDescriptor";
import { Constants } from "../Constants";
import { ColumnDescriptor } from "../../types/ColumnDescriptor";

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
	columns: Array<ColumnDescriptor>;
}

export type ProcessTableProps = ProcessTableStateProps & ProcessTableActionProps;

export class ProcessTable extends Component<ProcessTableProps, ProcessTableState> {

	constructor(props: ProcessTableProps) {
		super(props);
		this.state = {
			columns: Constants.DEFAULT_COLUMN_SET,
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
				{columns && columns.map((columnDescriptor: ColumnDescriptor) => {
					const { columnName, sortable, key } = columnDescriptor;
					const activeKey = !!(sortedBy && key === sortedBy.key);
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

	renderBody = (processes: Array<Process>) => {
		return (
			<tbody>
			{processes.map((process: Process) => {
				return (
					<tr key={process.pid}>
						{this.state.columns.map((columnDescriptor: ColumnDescriptor) => {
							const { key } = columnDescriptor;
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
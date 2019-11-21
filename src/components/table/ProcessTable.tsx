import React from "react";
import { FC } from "react";
import "./ProcessTable.css";
import { Process } from "../../types/Process";

export interface ProcessTableProps {
	processes: Array<Process>;
}

const renderProcessData = (process: Process) => {
	return (
		<div className="article-main">
			<div className="title">{process.pid}</div>
			<div className="date">{process.creationDate}</div>
		</div>
	);
};

export const ProcessTable: FC<ProcessTableProps> = (props: ProcessTableProps) => {
	return (
		<div className="process-table">
			{props.processes && props.processes.map((process: Process) => {
				return (
					<div
						key={process.pid}
						className="single-article"
					>
						{renderProcessData(process)}
					</div>
				);
			})}
		</div>
	);
};
import { Process } from "../types/Process";
import { ColumnDescriptor } from "../types/ColumnDescriptor";

export class Constants {
	static DEFAULT_SERVER_ADDRESS = "ws://localhost:8080/pe-websocket";
	static SIMPLE_VIEW_SERIES_NAME = "CPU Usage %";
	static SIMPLE_VIEW_CHART_TITLE = "Overall CPU Usage %";
	static DETAILED_VIEW_CHART_TITLE = "CPU Usage % by Process Name and PID";
	static DEFAULT_POLLING_INTERVAL = 1000;
	static RECONNECT_DELAY = 5000;
	static Y_AXIS_LABEL_FORMAT = "{value}%";

	/**
	 * Configuration to match Process object fields to Column names
	 */
	static COLUMN_DESCRIPTORS: Record<Partial<keyof Process>, ColumnDescriptor> = {
		"pid": {
			columnName: "PID",
			sortable: true,
			sortingType: "number",
		},
		"time": {
			columnName: "Execution time",
			sortable: false,
		},
		"name": {
			columnName: "Name",
			sortable: true,
			sortingType: "string",
		},
		"physicalMemory": {
			columnName: "Physical Memory",
			sortable: true,
			sortingType: "number",
		},
		"virtualMemory": {
			columnName: "Virtual Memory",
			sortable: true,
			sortingType: "number",
		},
		"executionPath": {
			columnName: "Path",
			sortable: true,
			sortingType: "string",
		},
		"cpuPercentage": {
			columnName: "CPU %",
			sortable: true,
			sortingType: "number",
		},
		"creationDate": {
			columnName: "Creation Date",
			sortable: true,
			sortingType: "string",
		},
	};
}
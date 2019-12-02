import { Process } from "../types/Process";
import { ColumnDescriptor } from "../types/ColumnDescriptor";

export class Constants {
	static DEFAULT_SERVER_ADDRESS = "ws://localhost:8080/pe-websocket";
	static SIMPLE_VIEW_SERIES_NAME = "CPU Usage %";
	static SIMPLE_VIEW_CHART_TITLE = "Overall CPU Usage %";
	static DETAILED_VIEW_CHART_TITLE = "CPU Usage by Process Name and PID";
	static DEFAULT_POLLING_INTERVAL = 1000;
	static MESSAGE_POPUP_TIMEOUT = 5000;
	static RECONNECT_DELAY = 5000;
	static Y_AXIS_LABEL_FORMAT = "{value}%";

	/**
	 * Configuration to match Process object fields to Column names
	 */
	static COLUMN_DESCRIPTORS: Record<Partial<keyof Process>, ColumnDescriptor> = {
		"pid": {
			key: "pid",
			columnName: "PID",
			sortable: true,
			sortingType: "number",
		},
		"time": {
			key: "time",
			columnName: "Execution time",
			sortable: false,
		},
		"name": {
			key: "name",
			columnName: "Name",
			sortable: true,
			sortingType: "string",
		},
		"physicalMemory": {
			key: "physicalMemory",
			columnName: "Physical Memory",
			sortable: true,
			sortingType: "number",
		},
		"virtualMemory": {
			key: "virtualMemory",
			columnName: "Virtual Memory",
			sortable: true,
			sortingType: "number",
		},
		"executionPath": {
			key: "executionPath",
			columnName: "Path",
			sortable: true,
			sortingType: "string",
		},
		"cpuPercentage": {
			key: "cpuPercentage",
			columnName: "CPU %",
			sortable: true,
			sortingType: "number",
		},
		"creationDate": {
			key: "creationDate",
			columnName: "Creation Date",
			sortable: true,
			sortingType: "string",
		},
	};

	static DEFAULT_COLUMN_SET = [
		Constants.COLUMN_DESCRIPTORS.pid,
		Constants.COLUMN_DESCRIPTORS.name,
		Constants.COLUMN_DESCRIPTORS.cpuPercentage,
		Constants.COLUMN_DESCRIPTORS.physicalMemory,
		Constants.COLUMN_DESCRIPTORS.time,
	];
}
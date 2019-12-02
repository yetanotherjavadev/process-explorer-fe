import { Process } from "./Process";

export interface SystemInfo {
	trackedProcesses: Array<Process>;
	uiProcesses: Array<Process>;
	currentTime: number;
	overallCpuUsage: number;
}
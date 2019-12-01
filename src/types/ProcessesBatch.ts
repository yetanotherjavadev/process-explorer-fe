import { Process } from "./Process";

export interface ProcessesBatch {
	processes: Array<Process>;
	currentTime: number;
}
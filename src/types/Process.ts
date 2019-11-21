export interface Process {
	pid: string;
	cpuPercentage: number;
	state: string;
	creationDate: number;
	executionPath: string;
}
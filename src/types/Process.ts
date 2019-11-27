export interface Process {
	pid: string;
	cpuPercentage: number;
	state: string;
	creationDate: string;
	executionPath: string;
	name: string;
}
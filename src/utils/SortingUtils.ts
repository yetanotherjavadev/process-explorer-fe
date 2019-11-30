import { Process } from "../types/Process";

export class SortingUtils {

	// some of the keys are treated as strings, others are floats, this is a quick sorting solution
	static sortByKey = (processes: Array<Process>, sortBy: { key: keyof Process, asc: boolean }): Array<Process> => {
		const { key, asc } = sortBy;
		const modifier = asc ? -1 : 1;
		if (key === "cpuPercentage" || key === "physicalMemory" || key === "virtualMemory") {
			processes.sort((o1: Process, o2: Process) => {
				if (o1[key] > o2[key]) {
					return modifier;
				}
				if (o1[key] < o2[key]) {
					return -modifier;
				}
				return 0;
			});
		} else {
			processes.sort((o1: Process, o2: Process) => {
				const float1 = Number.parseFloat(o1[key]);
				const float2 = Number.parseFloat(o2[key]);
				if (float1 > float2) {
					return modifier;
				}
				if (float1 < float2) {
					return -modifier;
				}
				return 0;
			});
		}
		return processes;
	};
}
import { Process } from "../types/Process";
import { SortingDescriptor } from "../types/SortingDescriptor";
import { Constants } from "../components/Constants";

export class SortingUtils {

	// some of the keys are treated as strings, others are floats, this is a quick sorting solution
	// string sorting is case insensitive
	static sortByKey = (processes: Array<Process>, sortBy: SortingDescriptor): Array<Process> => {
		const { key, asc } = sortBy;
		const columnDescriptor = Constants.COLUMN_DESCRIPTORS[key];
		const modifier = asc ? -1 : 1;
		if (columnDescriptor.sortingType === "number") {
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
		} else if (columnDescriptor.sortingType === "string") {
			processes.sort((o1: Process, o2: Process) => {
					const lowerCase1 = o1[key].toLowerCase();
					const lowerCase2 = o2[key].toLowerCase();
					if (lowerCase1 > lowerCase2) {
						return modifier;
					}
					if (lowerCase1 < lowerCase2) {
						return -modifier;
					}
					return 0;
				}
			);
		}
		return processes;
	};
}
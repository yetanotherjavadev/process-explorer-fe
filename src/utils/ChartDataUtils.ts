import { Process } from "../types/Process";
import { SeriesData } from "../types/ChartDataTypes";

export class ChartDataUtils {

	/**
	 * Parses raw data from processes to object
	 *
	 * @return an object of form: { pid: cpuUsage, pid2: cpuUsage2, ... }
	 */
	static prepareDataForChart = (processes: Array<Process>): Record<string, number> => {
		const result: Record<string, number> = {};
		processes.forEach((process: Process) => {
			const compoundKey = `${process.name}(${process.pid})`;
			result[compoundKey] = Number.parseFloat(process.cpuPercentage);
		});
		return result;
	};

	/**
	 * Transforms processes data into series to provide to charts
	 * @param processes - Array<Process> raw data from server
	 */
	static getInitialSeriesData = (processes: Array<Process>): Array<SeriesData> => {
		const result: Array<SeriesData> = [];
		processes.forEach((process: Process) => {
			result.push(
				{
					name: `${process.name}(${process.pid})`,
					// id: p.pid,
					data: [Number.parseFloat(process.cpuPercentage)],
				}
			);
		});
		return result;
	};
}
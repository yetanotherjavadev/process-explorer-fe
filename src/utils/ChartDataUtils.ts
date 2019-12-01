import { Process } from "../types/Process";
import { SeriesData } from "../types/ChartDataTypes";
import { ProcessesBatch } from "../types/ProcessesBatch";

export class ChartDataUtils {
	/**
	 * Parses raw data from processes to object
	 * @return an object of form: { pid: cpuUsage, pid2: cpuUsage2, ... }
	 */
	static prepareDataForChart = (processesBatch: ProcessesBatch, offline?: boolean): Record<string, Array<number>> => {
		const result: Record<string, Array<number>> = {};
		const xValue = processesBatch.currentTime;
		processesBatch.processes.forEach((process: Process) => {
			const compoundKey = `${process.name}(${process.pid})`;
			const yValue = offline ? 0.0 : Number.parseFloat(process.cpuPercentage);
			result[compoundKey] = [xValue, yValue];
		});
		return result;
	};

	/**
	 * Transforms processes data into series to provide to charts
	 * @param processesBatch - Array<Process> and timestamp as raw data from server
	 */
	static getInitialSeriesData = (processesBatch: ProcessesBatch): Array<SeriesData> => {
		const result: Array<SeriesData> = [];
		const xValue = processesBatch.currentTime;
		processesBatch.processes.forEach((process: Process) => {
			result.push(
				{
					name: `${process.name}(${process.pid})`,
					data: [[xValue, Number.parseFloat(process.cpuPercentage)]],
				}
			);
		});
		return result;
	};
}
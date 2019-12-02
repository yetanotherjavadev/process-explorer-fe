import { Process } from "../types/Process";
import { SeriesData } from "../types/ChartDataTypes";
import { SystemInfo } from "../types/SystemInfo";

export class ChartDataUtils {

	/**
	 * Checks if current series is a "full match" to the data constructed from fresh props
	 *
	 * @param series - currently displayed series
	 * @param newData - data from props
	 *
	 * @return the SeriesData that IS NOT PRESENT in fresh data or undefined if new and old series match
	 */
	static getInvalidKey = (series: Array<SeriesData>, newData: Record<string, Array<number>>): SeriesData | undefined => {
		for (let i = 0; i < series.length; i++) {
			if ((newData as any)[series[i].name] === undefined) {
				return series[i];
			}
		}
		return undefined;
	};

	/**
	 * Parses raw data from processes to object with pids as keys and array of cpu usage values as values
	 * @return an object of form: { pid: cpuUsage, pid2: cpuUsage2, ... }
	 */
	static prepareDataForChart = (systemInfo: SystemInfo, offline?: boolean): Record<string, Array<number>> => {
		const result: Record<string, Array<number>> = {};
		const xValue = systemInfo.currentTime;
		systemInfo.uiProcesses.forEach((process: Process) => {
			const compoundKey = `${process.name}(${process.pid})`;
			const yValue = offline ? 0.0 : Number.parseFloat(process.cpuPercentage);
			result[compoundKey] = [xValue, yValue];
		});
		return result;
	};

	/**
	 * Parses raw data for CPU Usage to an array for Chart series
	 * @return a pair of values - [time, percent_cpu_usage_value]
	 */
	static prepareCPUDataForChart = (systemInfo: SystemInfo, offline?: boolean): Array<number> => {
		const cpuUsageValue = offline ? 0.0 : systemInfo.overallCpuUsage;
		return [systemInfo.currentTime, cpuUsageValue];
	};

	/**
	 * Transforms processes data into series to provide to charts
	 * @param systemInfo - SystemInfo - raw data from server
	 */
	static getInitialSeriesData = (systemInfo: SystemInfo): Array<SeriesData> => {
		const result: Array<SeriesData> = [];
		const xValue = systemInfo.currentTime;
		systemInfo.uiProcesses.forEach((process: Process) => {
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
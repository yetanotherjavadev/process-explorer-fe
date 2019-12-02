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
	 * Parses raw data from processes to object with (name+pid) as keys and array of cpu usage values as values
	 *
	 * @param lastTick - used to calculate "next step on X axis" in case if we're in offline mode
	 * @param systemInfo - raw data from server
	 * @param offline - if true then we're offline
	 * @return an object of form: { pid: cpuUsage, pid2: cpuUsage2, ... }
	 */
	static prepareDataForChart = (lastTick: number, systemInfo: SystemInfo, offline?: boolean): Record<string, Array<number>> => {
		const result: Record<string, Array<number>> = {};
		const xValue = offline ? lastTick + 1000 : systemInfo.currentTime;
		systemInfo.uiProcesses.forEach((process: Process) => {
			const compoundKey = `${process.name}(${process.pid})`;
			const yValue = offline ? 0.0 : Number.parseFloat(process.cpuPercentage);
			result[compoundKey] = [xValue, yValue];
		});
		return result;
	};

	/**
	 * Parses raw data for Overall CPU Usage to an array for Chart series
	 *
	 * @param lastTick - used to calculate "next step on X axis" in case if we're in offline mode
	 * @param systemInfo - raw data from server
	 * @param offline - if true then we're offline
	 *
	 * @return a pair of values - [time, percent_cpu_usage_value]
	 */
	static prepareCPUDataForChart = (lastTick: number, systemInfo: SystemInfo, offline?: boolean): Array<number> => {
		const newTimeValue = offline ? lastTick + 1000 : systemInfo.currentTime;
		const cpuUsageValue = offline ? 0.0 : systemInfo.overallCpuUsage;
		return [newTimeValue, cpuUsageValue];
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
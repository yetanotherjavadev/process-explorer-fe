import React, { Component } from "react";
import "./ChartComponent.css";
import { Options } from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { SeriesData } from "../../types/ChartDataTypes";
import { ChartDataUtils } from "../../utils/ChartDataUtils";
import { chartTheme } from "./theme/ChartTheme";
import { Constants } from "../Constants";
import { SystemInfo } from "../../types/SystemInfo";
import Button from "react-bootstrap/Button";

export interface ChartComponentProps {
	systemInfo: SystemInfo;
	pollingActive: boolean;
}

export interface ChartComponentState {
	chartOptions: Options;
	isDetailedData: boolean;
}

export class ChartComponent extends Component<ChartComponentProps, ChartComponentState> {

	// private fields used to store both types of series data (simple and detailed) for easy switching
	private cpuData: SeriesData = {
		name: Constants.SIMPLE_VIEW_SERIES_NAME,
		data: [],
	};
	private detailedData: Array<SeriesData> = [];

	constructor(props: ChartComponentProps) {
		super(props);
		Highcharts.setOptions(chartTheme);
		this.state = {
			isDetailedData: false,
			chartOptions: {
				chart: {
					animation: false,
					width: "900",
					reflow: true,
				},
				title: {
					text: Constants.SIMPLE_VIEW_CHART_TITLE,
				},
				yAxis: {
					labels: {
						format: Constants.Y_AXIS_LABEL_FORMAT,
					}
				},
				xAxis: {
					type: "datetime",
					labels: {
						format: "{value: %l:%M:%S}",
					},
				} as any,
				tooltip: {
					formatter: function () {
						return "CPU Usage for <b>" + this.series.name + "</b> is <b>" + this.y.toFixed(2) + "</b>";
					}
				},
			},
		};
	}

	/**
	 * Updates current series with fresh values from props data.
	 * If previous data was not there - creates initial values.
	 *
	 * @param limit - a limiting number to trim the array of values (= max # of X points of a series shown on the chart at the same time)
	 */
	getUpdatedSeries = (limit: number = 10): Array<SeriesData> => {
		const prevSeries = this.detailedData;
		const newDataFromProps: Record<string, Array<number>> = ChartDataUtils.prepareDataForChart(this.props.systemInfo, !this.props.pollingActive);
		const newCpuDataFromProps: Array<number> = ChartDataUtils.prepareCPUDataForChart(this.props.systemInfo, !this.props.pollingActive);

		let perCpuResult: Array<SeriesData>;
		let cpuResult: Array<SeriesData>;

		// calculate per-process CPU data
		if (prevSeries.length !== 0) {
			const newSeries = prevSeries.map((seriesData: SeriesData) => {
				const newData = [...seriesData.data];
				if (newData && newData.length >= limit) {
					newData.shift();
				}
				newData.push(newDataFromProps[seriesData.name]);
				return { name: seriesData.name, data: newData };
			});
			const invalidSeries = ChartDataUtils.getInvalidKey(prevSeries, newDataFromProps);
			if (invalidSeries) {
				perCpuResult = ChartDataUtils.getInitialSeriesData(this.props.systemInfo);
			}
			perCpuResult = newSeries;
		} else {
			perCpuResult = ChartDataUtils.getInitialSeriesData(this.props.systemInfo);
		}

		// calculate CPU data
		const { data, name } = this.cpuData;
		const newData = [...data];
		if (newData.length >= limit) {
			newData.shift();
		}
		newData.push(newCpuDataFromProps);
		cpuResult = [{ name, data: newData }];

		this.detailedData = perCpuResult;
		this.cpuData = cpuResult[0];

		return this.state.isDetailedData ? perCpuResult : cpuResult;
	};

	componentDidMount() {
		setInterval(() => {
			const updatedSeries = this.getUpdatedSeries(20);
			this.setState({
				chartOptions: {
					series: updatedSeries,
				},
			} as any);
		}, Constants.DEFAULT_POLLING_INTERVAL);
	}

	toggleDetailedData = (detailed: boolean) => {
		const updatedSeries = this.getUpdatedSeries(20);
		const chartTitle = detailed ? Constants.DETAILED_VIEW_CHART_TITLE : Constants.SIMPLE_VIEW_CHART_TITLE;
		this.setState({
			isDetailedData: detailed,
			chartOptions: {
				series: updatedSeries,
				title: {
					text: chartTitle,
				},
			}
		} as any);
	};

	render() {
		return (
			<div className="ChartComponent">
				<div className="chart-container">
					<HighchartsReact
						highcharts={Highcharts}
						options={this.state.chartOptions}
					/>
				</div>
				<div className="button-block">
					<Button variant="dark" active={!this.state.isDetailedData} onClick={() => this.toggleDetailedData(false)}>Simple view</Button>
					<Button variant="dark" active={this.state.isDetailedData} onClick={() => this.toggleDetailedData(true)}>Detailed view</Button>
				</div>
			</div>
		);
	}
}
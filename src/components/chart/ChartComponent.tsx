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

export interface ChartComponentStateProps {
	systemInfo: SystemInfo;
	pollingActive: boolean;
}

export interface ChartComponentActionProps {
	actions: {
		startPolling: () => void;
		stopPolling: () => void;
	};
}

export interface ChartComponentState {
	chartOptions: Options;
	isDetailedData: boolean;
}

export type ChartComponentProps = ChartComponentActionProps & ChartComponentStateProps;

export class ChartComponent extends Component<ChartComponentProps, ChartComponentState> {

	// private fields used to store both types of series data (simple and detailed) for easy switching
	private simpleData: SeriesData = {
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
				time: {
					timezoneOffset: -120, // hardcoded for UTC+2 now, TODO: this should be calculated per client time zone
				},
				chart: {
					animation: false,
					width: "900",
					reflow: true,
					height: "700",
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
	 * Updates current detailed series with fresh values from props data.
	 * If previous data was not there - creates initial values.
	 *
	 * @param limit - a limiting number to trim the array of values (= max # of X points of a series shown on the chart at the same time)
	 */
	getDetailedSeriesUpdated = (limit: number): Array<SeriesData> => {
		const prevSeries = this.detailedData;
		const lastTick = prevSeries[0] && prevSeries[0].data ? prevSeries[0].data[prevSeries[0].data.length - 1][0] : 0; // last X axis value stored in local variable
		const newDataFromProps: Record<string, Array<number>> = ChartDataUtils.prepareDataForChart(lastTick, this.props.systemInfo, !this.props.pollingActive);
		if (prevSeries.length !== 0) {
			const newSeries = prevSeries.map((seriesData: SeriesData) => {
				const newData = [...seriesData.data];
				if (newData && newData.length >= limit) {
					newData.shift();
				}
				newData.push(newDataFromProps[seriesData.name]);
				return { name: seriesData.name, data: newData };
			});
			// in case if we killed a process that was shown in the chart
			const invalidSeries = ChartDataUtils.getInvalidKey(prevSeries, newDataFromProps);
			if (invalidSeries) {
				return ChartDataUtils.getInitialSeriesData(this.props.systemInfo);
			}
			return newSeries;
		} else {
			return ChartDataUtils.getInitialSeriesData(this.props.systemInfo);
		}
	};

	/**
	 * Updates current simple view series with fresh values from props data.
	 * If previous data was not there - creates initial values.
	 *
	 * @param limit - a limiting number to trim the array of values (= max # of X points of a series shown on the chart at the same time)
	 */
	getSimpleSeriesUpdated = (limit: number): SeriesData => {
		const { data, name } = this.simpleData;
		const lastTick = data && data.length ? data[data.length - 1][0] : 0; // last X axis value is stored in local variable
		const newCpuDataFromProps: Array<number> = ChartDataUtils.prepareCPUDataForChart(lastTick, this.props.systemInfo, !this.props.pollingActive);

		const newData = [...data];
		if (newData.length >= limit) {
			newData.shift();
		}
		newData.push(newCpuDataFromProps);
		return { name, data: newData };
	};

	updateValues = () => {
		this.simpleData = this.getSimpleSeriesUpdated(20);
		this.detailedData = this.getDetailedSeriesUpdated(20);
	};

	componentDidMount() {
		setInterval(() => {
			this.updateValues();
			const dataToShow = this.state.isDetailedData ? this.detailedData : this.simpleData;
			this.setState({
				chartOptions: {
					series: dataToShow,
				},
			} as any);
		}, Constants.DEFAULT_POLLING_INTERVAL);
	}

	toggleDetailedData = (detailed: boolean) => {
		this.updateValues();
		const dataToShow = this.state.isDetailedData ? this.detailedData : this.simpleData;
		const chartTitle = detailed ? Constants.DETAILED_VIEW_CHART_TITLE : Constants.SIMPLE_VIEW_CHART_TITLE;
		this.setState({
			isDetailedData: detailed,
			chartOptions: {
				series: dataToShow,
				title: {
					text: chartTitle,
				},
			}
		} as any);
	};

	togglePolling = () => {
		if (this.props.pollingActive) {
			this.props.actions.stopPolling();
		} else {
			this.props.actions.startPolling();
		}
	};

	render() {
		const { pollingActive } = this.props;
		const btnText = pollingActive ? "Stop polling" : "Start polling";
		return (
			<div className="ChartComponent">
				<div className="button-block">
					<div className="button-block-left">
						<Button variant="dark" onClick={this.togglePolling}>{btnText}</Button>
					</div>
					<div className="button-block-right">
						<Button variant="dark" active={!this.state.isDetailedData} onClick={() => this.toggleDetailedData(false)}>Simple view</Button>
						<Button variant="dark" active={this.state.isDetailedData} onClick={() => this.toggleDetailedData(true)}>Detailed view</Button>
					</div>
				</div>
				<div className="chart-container">
					<HighchartsReact
						highcharts={Highcharts}
						options={this.state.chartOptions}
					/>
				</div>
			</div>
		);
	}
}
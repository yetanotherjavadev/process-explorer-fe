import React, { Component } from "react";
import "./ChartComponent.css";
import { Options } from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { SeriesData } from "../../types/ChartDataTypes";
import { ChartDataUtils } from "../../utils/ChartDataUtils";
import { chartTheme } from "./theme/ChartTheme";
import { Constants } from "../Constants";
import { ProcessesBatch } from "../../types/ProcessesBatch";

export interface ChartComponentProps {
	processesBatch: ProcessesBatch;
	pollingActive: boolean;
}

export interface ChartComponentState {
	chartOptions: Options;
}

const CHART_TITLE = "CPU Usage By Process Name";
const Y_AXIS_LABEL_FORMAT = "{value}%";

export class ChartComponent extends Component<ChartComponentProps, ChartComponentState> {

	constructor(props: ChartComponentProps) {
		super(props);
		Highcharts.setOptions(chartTheme);
		this.state = {
			chartOptions: {
				chart: {
					animation: false,
					width: "900",
					reflow: true,
				},
				title: {
					text: CHART_TITLE,
				},
				yAxis: {
					labels: {
						format: Y_AXIS_LABEL_FORMAT,
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
						return "CPU Usage for <b>" + this.series.name + "</b> is <b>" + this.y + "</b>";
					}
				},
				plotOptions: {
					series: {
						events: {
							mouseOver: function (e: PointerEvent) {
								// window.console.log("i'm over!", (e.target as any).userOptions.name);
								window.console.log("i'm over!", (e.target as any));
								// window.console.log(chart.legend);
							},
						}
					}
				},
			},
		};
	}

	/**
	 * Updates current series with fresh values from props data.
	 * If previous data was not there - creates initial values.
	 *
	 * @param prevSeries - series data that is currently displayed by chart
	 * @param limit - a limiting number to trim the array of values (= max # of points of a series shown on the chart at the same time)
	 */
	getUpdatedSeries = (prevSeries?: Array<SeriesData>, limit: number = 10): Array<SeriesData> => {
		const newDataFromProps: Record<string, Array<number>> = ChartDataUtils.prepareDataForChart(this.props.processesBatch, !this.props.pollingActive);

		let iter = 0;
		if (prevSeries && prevSeries.length !== 0) {
			prevSeries.forEach((seriesData: SeriesData) => {
				if (seriesData.data && seriesData.data.length >= limit) {
					const updatedData = seriesData.data.slice(1);
					updatedData.push(newDataFromProps[seriesData.name]);
					prevSeries[iter].data = updatedData;
				} else {
					seriesData.data.push(newDataFromProps[seriesData.name]);
				}
				// window.console.log(seriesData.name, prevSeries[iter].data);
				iter++;
			});
			return prevSeries;
		} else {
			return ChartDataUtils.getInitialSeriesData(this.props.processesBatch);
		}
	};

	componentDidMount() {
		const { chartOptions } = this.state;
		setInterval(() => {
			const updatedSeries = this.getUpdatedSeries(chartOptions.series as any, 20);
			this.setState({
				chartOptions: {
					series: updatedSeries,
				}
			} as any);
		}, Constants.DEFAULT_POLLING_INTERVAL);
	}

	render() {
		return (
			<div className="chart-container">
				<HighchartsReact
					highcharts={Highcharts}
					options={this.state.chartOptions}
				/>
			</div>
		);
	}
}
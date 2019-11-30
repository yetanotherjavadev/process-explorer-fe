import React, { Component } from "react";
import "./ChartComponent.css";
import { Options } from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Process } from "../../types/Process";
import { SeriesData } from "../../types/ChartDataTypes";
import { ChartDataUtils } from "../../utils/ChartDataUtils";
import { chartTheme } from "./theme/ChartTheme";
import { Constants } from "../Constants";

export interface ChartComponentProps {
	processes: Array<Process>;
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
				// xAxis: { // TODO: use dates here
				// 	type: "datetime",
				// },
				tooltip: {
					formatter: function () {
						return "CPU Usage for <b>" + this.series.name + "</b> is <b>" + this.y + "</b>";
					}
				},
			}
		};
	}

	/**
	 * Updates current series with fresh values from props data.
	 * If previous data was not there - creates initial values.
	 *
	 * @param prevSeries - series data that is currently displayed by chart
	 * @param limit - a limiting number to trim the array of values
	 */
	getUpdatedSeries = (prevSeries?: Array<SeriesData>, limit: number = 10): Array<SeriesData> => {
		const newDataFromProps = ChartDataUtils.prepareDataForChart(this.props.processes);

		let iter = 0;
		if (prevSeries && prevSeries.length !== 0) {
			prevSeries.forEach((seriesData: SeriesData) => {
				if (seriesData.data && seriesData.data.length >= limit) {
					const upd = seriesData.data.slice(1);
					upd.push(newDataFromProps[seriesData.name]);
					prevSeries[iter].data = upd;
				} else {
					seriesData.data.push(newDataFromProps[seriesData.name]);
				}
				// window.console.log(seriesData.name, prevSeries[iter].data);
				iter++;
			});
			return prevSeries;
		} else {
			return ChartDataUtils.getInitialSeriesData(this.props.processes);
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
					// constructorType={"stockChart"}
					options={this.state.chartOptions}
				/>
			</div>
		);
	}
}
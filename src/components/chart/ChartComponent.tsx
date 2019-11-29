import React, { Component } from "react";
import "./ChartComponent.css";
import Highcharts, { Options } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Process } from "../../types/Process";

export interface ChartComponentProps {
	processes: Array<Process>;
}

export interface ChartComponentState {
	options: Options;
}

const options: Options = {
	chart: {
		type: "line",
	},
	title: {
		text: "CPU Usage By Process Name"
	},
	xAxis: {
		categories: ["1750", "1800", "1850"],
	},
	yAxis: {
		labels: {
			format: "{value}%"
		}
	},
	time: {
		useUTC: false
	},
	rangeSelector: {
		buttons: [{
			count: 1,
			type: "minute",
			text: "1M"
		}, {
			count: 5,
			type: "minute",
			text: "5M"
		}, {
			type: "all",
			text: "All"
		}],
		inputEnabled: false,
		selected: 0
	},
	series: [
		{
			name: "162",
			data: [0.5, 0.5, 0.7]
		},
		{
			name: "416",
			data: [2.2, 5.5, 6.5]
		},
		{
			name: "7365",
			data: [5.6, 2.5, 4.4]
		},
		{
			name: "7387",
			data: [2.6, 2.7, 4.6]
		},
		{
			name: "35146",
			data: [6.0, 2.7, 4.6]
		}] as any,
};

export class ChartComponent extends Component<ChartComponentProps, ChartComponentState> {

	constructor(props: ChartComponentProps) {
		super(props);
		this.state = {
			options: {
				...options,
			}
		};
	}

	prepareDataForChart = (): Record<string, number> => {
		const { processes } = this.props;
		const result: Record<string, number> = {};
		processes.forEach((process: Process) => {
			result[process.pid] = Number.parseFloat(process.cpuPercentage);
		});
		return result;
	};

	getUpdatedSeries = (prevSeries: any): Array<any> => {
		const newData = this.prepareDataForChart();

		let iter = 0;
		prevSeries.forEach((o: any) => {
			if (o.data && o.data.length >= 10) {
				const upd = o.data.slice(1);
				upd.push(newData[o.name]);
				prevSeries[iter].data = upd;
			} else {
				o.data.push(newData[o.name]);
			}
			window.console.log(o.name, prevSeries[iter].data);
			iter++;
		});
		return prevSeries;
	};

	getInitialSeriesData = (): Array<any> => {
		const result: Array<any> = [];
		this.props.processes.forEach((p: Process) => {
			result.push(
				{
					name: p.pid,
					data: [p.cpuPercentage],
				}
			);
		});
		return result;
	};

	componentDidMount() {
		const { options } = this.state;
		const component = this;

		// const initialSeries = this.getInitialSeriesData();
		// component.setState({
		// 	options: {
		// 		series: initialSeries,
		// 	}
		// });
		setInterval(() => {
			const updatedSeries = this.getUpdatedSeries(options.series as any);

			component.setState({
				options: {
					series: updatedSeries,
				}
			} as any);
		}, 1000);
	}

	render() {
		return (
			<div className="chart-container">
				<HighchartsReact
					highcharts={Highcharts}
					options={this.state.options}
				/>
			</div>
		);
	}
}
import React from "react";
import ReactDOMServer from "react-dom/server";
import {Line} from "react-chartjs-2";

import "./chart-legend.scss"

class LineChart extends React.Component {

	constructor(props) {
		super(props);

		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);

		this.chartInstance = undefined;
	}

	chartRef(ref) {
		if (ref !== null){
			this.chartInstance = ref.chartInstance;
		}
	}

	legendRef(ref) {
		if (ref !== null) {
			ref.innerHTML = this.chartInstance.generateLegend();

			Object.values(ref.childNodes).map((child, index) => {
				child.addEventListener('click', (e) => this.onClickLegend(e.currentTarget))
			});
		}
	}

	onClickLegend(element) {

		let index = Object.values(element.parentNode.childNodes).indexOf(element);
	   	this.chartInstance.data.datasets[index].hidden = !this.chartInstance.data.datasets[index].hidden;

	   	if (element.classList.contains('disable-legend')) {
	   		element.classList.remove('disable-legend')

	   	} else {
	   		element.classList.add('disable-legend')
	   	}

	   	this.chartInstance.update();
	}

	render() {

		if (this.props.traj !== null) {

			let data = {
				labels: Object.keys(Object.values(this.props.traj)[0]),
				datasets : Object.keys(this.props.traj).map(
					(key, index) => {
						return {
							label: key,
							data: Object.values(this.props.traj[key]),
							fill: false,
            				backgroundColor: this.props.colormap[index%this.props.colormap.length],
          					borderColor: this.props.colormap[index%this.props.colormap.length],
						};
					}
				)
			};

			let options = {
				legend: {
					display: false,
				},

				legendCallback: (chart) => ReactDOMServer.renderToStaticMarkup(
					chart.data.datasets.map(
						(dataset, index) => <div key={index} className={"legend-item"}>
							<span className={"legend-color"}
								style={{backgroundColor: dataset.backgroundColor}}
							></span>
							<span className={"legend-label"}>{dataset.label}</span>
						</div>
					)
				),
			};

			return (
				<React.Fragment>
					<Line data={data} options={options} ref={this.chartRef}/>
					<div ref={this.legendRef} className={"chart-legend"}></div>
				</React.Fragment>
			);
		}
	}
}

export default LineChart;
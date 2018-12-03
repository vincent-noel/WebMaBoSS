import React from "react";
import {Pie} from "react-chartjs-2";
import ReactDOMServer from "react-dom/server";

import "./chart-legend.scss"

class PieChart extends React.Component {

	constructor(props) {
		super(props);

		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);

		this.chartInstance = null;
	}

	chartRef(ref) {
		if (ref !== null){
			this.chartInstance = ref.chartInstance;
		}
	}

	legendRef(ref) {
		if (ref !== null) {
			ref.innerHTML = this.chartInstance.generateLegend();

			Object.values(ref.childNodes).map((child) => {
				child.addEventListener('click', (e) => this.onClickLegend(e.currentTarget))
			});
		}
	}

	onClickLegend(element) {

		let index = Object.values(element.parentNode.childNodes).indexOf(element);

	   	this.chartInstance.data.datasets[0]._meta[this.chartInstance.id].data[index].hidden = (
	   		!this.chartInstance.data.datasets[0]._meta[this.chartInstance.id].data[index].hidden
		);

	   	if (element.classList.contains('disable-legend')) {
	   		element.classList.remove('disable-legend')

	   	} else {
	   		element.classList.add('disable-legend')
	   	}

	   	this.chartInstance.update();
	}

    render() {

		if (this.props.table !== null) {

			let data = {
				labels: Object.keys(this.props.table),
				datasets: [{
					data: Object.values(this.props.table),
					backgroundColor: Object.values(this.props.table).map(
						(value, index) => { return this.props.colormap[index]}
					)
				}]
			};

			let options = {
				legend: {
					display: false,
				},

				legendCallback: (chart) => ReactDOMServer.renderToStaticMarkup(
					chart.data.labels.map(
						(datalabel, index) => <div key={index} className={"legend-item"}>
							<span className={"legend-color"} key={"rect_" + index}
								style={{backgroundColor: chart.data.datasets[0].backgroundColor[index]}}
							></span>
							<span className={"legend-label"}>{datalabel}</span>
						</div>
					)
				),

				title: {
					display: true,
					text: this.props.title
				}
			};

			return <React.Fragment>
				<Pie data={data} options={options} ref={this.chartRef}/>
				<div ref={this.legendRef} className={"chart-legend"}></div>
			</React.Fragment>;
		}
	}
}

export default PieChart;
import React from "react";
import LoadingIcon from "../commons/loaders/LoadingIcon";
import {Bubble} from "react-chartjs-2";
import "./chart-legend.scss"
import ReactDOMServer from "react-dom/server";

class PCAChart extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			imgHref: null,
			showArrows: true,
		};

		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);
		this.downloadRef = React.createRef();
		this.parentRef = React.createRef();

		this.chartInstance = null;
		this.legend = null;

		// this.chartWidth = null;
		// this.chartHeight = null;
	}

	chartRef(ref) {
		if (ref !== null){
			this.chartInstance = ref.chartInstance;
		}
	}

	legendRef(ref) {
		if (ref !== null) {
			this.legend = ref;
			ref.innerHTML = this.chartInstance.generateLegend();

			Object.values(ref.childNodes).map((child) => {
				child.addEventListener('click', (e) => this.onClickLegend(e.currentTarget))
			});
		}
	}

	onClickLegend(element) {

		let index = Object.values(element.parentNode.childNodes).indexOf(element);

		if (index < this.chartInstance.data.datasets.length) {

		console.log(this.chartInstance.data)


	   	this.chartInstance.data.datasets[index]._meta[this.chartInstance.id].hidden = (
	   		!this.chartInstance.data.datasets[index]._meta[this.chartInstance.id].hidden
		)
		} else {
			this.setState({showArrows: !this.state.showArrows});
		}

	   	if (element.classList.contains('disable-legend')) {
	   		element.classList.remove('disable-legend')

	   	} else {
	   		element.classList.add('disable-legend')
	   	}

	   	this.setState({imgHref: null});
	   	this.chartInstance.update();
	}

	componentWillMount() {

		Chart.pluginService.register({
			id: 'pcaArrows',
			afterDraw: (chart, easing) => {
				// console.log("after draw");
				if (chart.chart.config.type == "bubble" && this.state.showArrows) {
					let x0 = chart.chartArea.left;
					let x1 = chart.chartArea.right;
					let y0 = chart.chartArea.top;
					let y1 = chart.chartArea.bottom;

					const xticks = chart.chart.scales['x-axis-0'].ticksAsNumbers;
					const yticks = chart.chart.scales['y-axis-0'].ticksAsNumbers;

					let vx0 = xticks[0];
					let vx1 = xticks[xticks.length - 1];
					let vy0 = yticks[0];
					let vy1 = yticks[yticks.length - 1];

					let x_ratio = (x1-x0)/(vx1-vx0);
					let y_ratio = (y1-y0)/(vy1-vy0);

					// console.log(this.props.arrows);
					// console.log(this.props.arrowLabels);

					let getX = (x) => {
						return x0 + (x - vx0) * x_ratio;
					};
					let getY = (y) => {
						return y0 + (y - vy0) * y_ratio;
					};


					this.props.arrows.map((values, index) => {
						chart.chart.ctx.restore();
						chart.chart.ctx.beginPath();
						chart.chart.ctx.strokeStyle = '#000000';
						chart.chart.ctx.moveTo(getX(0), getY(0));
						chart.chart.ctx.lineTo(getX(values[0]), getY(values[1]));
						chart.chart.ctx.stroke();

						let size_labels = this.props.arrowLabels[index].length * 20;

						this.props.arrowLabels[index].map((label, index) => {
							console.log(label);
							chart.chart.ctx.fillText(label, getX(values[0]), getY(values[1])+(index*20)-(size_labels/2));
						});

					});
				}
			}
		});

	}

	render() {

		if (this.props.data !== null) {
			let data = {

			  datasets: Object.keys(this.props.data).map((key, index) => {

			  	const xy = this.props.data[key];
			  	return {
				  label: key,
				  fill: false,
				  lineTension: 0.1,
				  backgroundColor: this.props.colormap[index % Object.keys(this.props.data).length],
				  borderColor: this.props.colormap[index % Object.keys(this.props.data).length],
				  borderCapStyle: 'butt',
				  borderDash: [],
				  borderDashOffset: 0.0,
				  borderJoinStyle: 'miter',
				  pointBorderColor: 'rgba(75,192,192,1)',
				  pointBackgroundColor: '#fff',
				  pointBorderWidth: 1,
				  pointRadius: 1,
				  pointHitRadius: 10,
				  data:	[{x: xy[0],y: xy[1], r:5}]
				}
			  })
			};

			let options = {
				legend: {
					display: false,
				},

				legendCallback: (chart) => {

					let legend = chart.data.datasets.map(
						(dataset, index) => <div key={index} className={"legend-item"}>
							<span className={"legend-color"} key={"rect_" + index}
								style={{backgroundColor: dataset.backgroundColor}}
							></span>
							<span className={"legend-label"}>{dataset.label}</span>
						</div>
					);

					legend.push(
						<div key={chart.data.datasets.length} className="legend-item">
							<span className="legend-color" key={"rect_" + chart.data.datasets.length}
								  style={{backgroundColor: "#000000"}}
							></span>
							<span className={"legend-label"}>Arrows</span>
						</div>
					);

					return ReactDOMServer.renderToStaticMarkup(legend);
				},

				plugins: {
					pcaArrows: {enable: true}
				},

				title: {
					display: true,
					text: this.props.title
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: this.props.xLabel
						}

					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: this.props.yLabel
						}

					}],
				}

			};

			return <React.Fragment>
				<Bubble data={data} options={options} ref={this.chartRef}/>
				<div ref={this.legendRef} className={"chart-legend"}></div>
			</React.Fragment>

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default PCAChart;
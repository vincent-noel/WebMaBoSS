import React from "react";
import ReactDOMServer from "react-dom/server";
import {Line} from "react-chartjs-2";

import "./chart-legend.scss"
import html2canvas from "html2canvas";
import {Button} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import LoadingIcon from "../commons/loaders/LoadingIcon";
import LoadingInlineIcon from "../commons/loaders/LoadingInlineIcon";

class LineChart extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			imgHref: null
		};

		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);
		this.downloadRef = React.createRef();
		this.parentRef = React.createRef();

		this.chartInstance = null;
		this.legend = null;

		this.chartWidth = null;
		this.chartHeight = null;
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

	   	this.setState({imgHref: null});
	   	this.chartInstance.update();
	}

	render() {

		if (this.props.traj !== null) {

			let data = {
				labels: Object.keys(Object.values(this.props.traj)[0]),
				datasets : Object.keys(this.props.traj).map(
					(key, index) => {

						let color;
						if (this.props.colorMap !== undefined) {
							color = this.props.colorMap[value]

						} else if (this.props.colorList !== undefined) {
							color = this.props.colorList[index % this.props.colorList.length]

						}

						return {
							label: key,
							data: Object.values(this.props.traj[key]),
							fill: false,
            				backgroundColor: color,
          					borderColor: color,
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
				title: {
					display: true,
					text: this.props.title
				},

				animation : {
					onComplete : (animation) => {

						// Here we have a problem, which is html2canvas triggers the animation, and is launch after the
						// animation completes. So it's a loop. So what we did is to only print it once after loading,
						// or after clicking on the legend, or after a detected size change
						if (this.chartInstance.width > 0 && (this.state.imgHref == null || this.chartHeight !== this.chartInstance.canvas.height || this.chartWidth !== this.chartInstance.canvas.width)){

							this.setState({imgHref: null});

							this.chartHeight = this.chartInstance.canvas.height;
							this.chartWidth = this.chartInstance.canvas.width;

							html2canvas(this.legend, {
								width: this.legend.offsetWidth,
								windowWidth: window.innerWidth - (
									document.getElementById("sidebar-wrapper").offsetWidth
								),
						        backgroundColor: null,
								logging: false
							}).then(canvas => {

								let canvas_res = document.createElement('canvas');

								canvas_res.width = this.chartInstance.canvas.width;
								canvas_res.height = (
									this.chartInstance.canvas.height + canvas.height
								);

								let ctx_res = canvas_res.getContext("2d");

								ctx_res.drawImage(this.chartInstance.canvas, 0, 0);
								ctx_res.drawImage(canvas, 0, this.chartInstance.canvas.height);

								let myImage = canvas_res.toDataURL("image/png");
								this.setState({imgHref: myImage});
							});
						}
					}
    			},

			};

			return (
				<React.Fragment>
					<div
						ref={this.parentRef}
						style={{position: "relative"}}
					>
						<Line data={data} options={options} ref={this.chartRef}/>
						<div ref={this.legendRef} className={"chart-legend"}></div>
						<a
						   style={{
								top: "3px",
								right: "0px",
								position: "absolute",
						   }}
						   href={this.state.imgHref}
						   download="chart.png"
						   ref={this.downloadRef}
						>
							<Button className="ml-1 btn-sm">
								{
									this.state.imgHref !== null ?
									<FontAwesomeIcon icon={faSave}/> :
									<LoadingInlineIcon width="1rem" dark/>
								}
							</Button>
						</a>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default LineChart;
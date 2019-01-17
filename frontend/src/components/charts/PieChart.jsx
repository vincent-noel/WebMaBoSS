import React from "react";
import {Pie} from "react-chartjs-2";
import ReactDOMServer from "react-dom/server";
import html2canvas from "html2canvas";
import "./chart-legend.scss"
import {Button} from "reactstrap";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoadingIcon from "./LineChart";

class PieChart extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			imgHref: null
		};

		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);
		this.downloadRef = React.createRef();

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

	   	this.setState({imgHref: null});
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
				},

				animation : {
					onComplete : (animation) => {

						// Here we have a problem, which is html2canvas triggers the animation, and is launch after the
						// animation completes. So it's a loop. So what we did is to only print it once after loading,
						// or after clicking on the legend, or after a detected size change
						if (this.chartInstance.width > 0 && (this.state.imgHref == null || this.chartHeight !== this.chartInstance.canvas.height || this.chartWidth !== this.chartInstance.canvas.width)){

							this.chartHeight = this.chartInstance.canvas.height;
							this.chartWidth = this.chartInstance.canvas.width;

							let canvas_res = document.createElement('canvas');

							canvas_res.width = this.chartInstance.canvas.width;
							canvas_res.height = (
								this.chartInstance.canvas.height +
								this.legend.offsetHeight
							);

							let ctx_res = canvas_res.getContext("2d");
							ctx_res.drawImage(this.chartInstance.canvas, 0, 0);

							html2canvas(this.legend, {
								width: this.legend.offsetWidth,
								windowWidth: this.legend.offsetWidth,
                                backgroundColor: null,
                                x: 0,
								logging: false
							}).then(canvas => {

								ctx_res.drawImage(canvas, 0, this.chartInstance.canvas.height);

								let myImage = canvas_res.toDataURL("image/png");
								this.setState({imgHref: myImage});
							});
						}
					}
    			},

			};

			return <React.Fragment>
				<div
					onMouseOver={() => {
					if (this.downloadRef.current !== null && this.chartInstance !== null && this.legend !== null) {
						this.downloadRef.current.style.display = "flex";
						this.downloadRef.current.style.justifyContent = "end";
						this.downloadRef.current.style.position = "relative";
						this.downloadRef.current.style.top = (- this.chartInstance.canvas.offsetHeight - this.legend.offsetHeight + 4).toString() + "px";

						}
					}}

					onMouseOut={() => {
						if (this.downloadRef.current !== null) {
							this.downloadRef.current.style.display= "none";
						}
					}}
				>
					<Pie data={data} options={options} ref={this.chartRef}/>
					<div ref={this.legendRef} className={"chart-legend"}></div>
					{ this.state.imgHref !== null ?
						<a href={this.state.imgHref} download="chart.png" ref={this.downloadRef} style={{display: "none"}}>
							<Button className="ml-1">
								<FontAwesomeIcon icon={faSave}/>
							</Button>
						</a> : null
					}

				</div>

			</React.Fragment>;
		}
	}
}

export default PieChart;
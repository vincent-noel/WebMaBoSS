import React from "react";
import {Pie} from "react-chartjs-2";
import ReactDOMServer from "react-dom/server";
import html2canvas from "html2canvas";
import "./chart-legend.scss"
import {Button} from "reactstrap";

class PieChart extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			imgHref: null
		};
		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);
		this.divRef = React.createRef();

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
						// or after clicking on the legend
						if (this.state.imgHref == null){
							html2canvas(this.divRef.current, {windowWidth: this.divRef.current.offsetWidth}).then(canvas => {
								let myImage = canvas.toDataURL("image/png");
								this.setState({imgHref: myImage});
							});
						}
					}
    			}
			};

			return <React.Fragment>
				<div ref={this.divRef}>
					<Pie data={data} options={options} ref={this.chartRef}/>
					<div ref={this.legendRef} className={"chart-legend"}></div>
				</div>
				{ this.state.imgHref !== null ?
					<a href={this.state.imgHref} download="chart.png">
						<Button className="mr-1">Download</Button>
					</a> :
					null
				}

			</React.Fragment>;
		}
	}
}

export default PieChart;
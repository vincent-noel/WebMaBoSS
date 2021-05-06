import React from "react";
import ReactDOMServer from "react-dom/server";
import {Line} from "react-chartjs-2";
import "./chart-legend.scss"
import {Button} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";

class LineChart extends React.Component {

	constructor(props) {
		super(props);

		this.chartRef = this.chartRef.bind(this);
		this.downloadRef = React.createRef();
		this.chartInstance = null;
	}

	chartRef(ref) {
		if (ref !== undefined && ref !== null){
			this.chartInstance = ref;
		}
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
				plugins: {
					legend: {
						position: "bottom",
						onClick: (e, legendItem) => {
							this.chartInstance.data.datasets[legendItem.datasetIndex].hidden = !this.chartInstance.data.datasets[legendItem.datasetIndex].hidden;
							this.setState({imgHref: null});
							this.chartInstance.update();
						}
					}
				},

				legendCallback: (chart) => {
					return ReactDOMServer.renderToStaticMarkup(
						chart.data.datasets.map(
							(dataset, index) => <div key={index} className={"legend-item"}>
								<span className={"legend-color"}
									style={{backgroundColor: dataset.backgroundColor}}
								></span>
								<span className={"legend-label"}>{dataset.label}</span>
							</div>
						)
					);
				},
				title: {
					display: true,
					text: this.props.title
				},

				animation : {
					onComplete : (animation) => {
						if (this.chartInstance !== undefined && this.chartInstance !== null) {
							let myImage = this.chartInstance.canvas.toDataURL();
							if (myImage.length > 6) {
								this.downloadRef.current.href = myImage;
							}
						}
					}
    			},

			};

			return (
				<React.Fragment>
					<div
						style={{position: "relative"}}
					>
						<Line 
							data={data} 
							options={options} 
							ref={this.chartRef}
						/>
						<a
						   style={{
								top: "3px",
								right: "0px",
								position: "absolute",
						   }}
						   href="data:,"
						   download="chart.png"
						   ref={this.downloadRef}
						>
							<Button className="ml-1 btn-sm">
								<FontAwesomeIcon icon={faSave}/>
							</Button>
						</a>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default LineChart;
import React from "react";
import {Pie} from "react-chartjs-2";
import ReactDOMServer from "react-dom/server";
import "./chart-legend.scss"
import {Button} from "reactstrap";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class PieChart extends React.Component {

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

		if (this.props.table !== null) {

			let data = {
				labels: Object.keys(this.props.table),
				datasets: [{
					data: Object.values(this.props.table),
					backgroundColor: Object.keys(this.props.table).map(
						(value, index) => {
							if (this.props.colorMap !== undefined) {
								return this.props.colorMap[value]

							} else if (this.props.colorList !== undefined) {
								return this.props.colorList[index % this.props.colorList.length]

							}
						}
					)
				}]
			};
			let options = {
				plugins: {
					legend: {
						position: "bottom",
					},
					title: {
						display: true,
						text: this.props.title
					},	
				},

				legendCallback: (chart) => {
					return ReactDOMServer.renderToStaticMarkup(
						Object.keys(this.props.table).map(
							(datalabel, index) => {
								return <div key={index} className={"legend-item"}>
									<span className={"legend-color"} key={"rect_" + index}
										style={{backgroundColor: chart.data.datasets[0].backgroundColor[index]}}
									></span>
									<span className={"legend-label"}>{datalabel}</span>
								</div>;
							}
						)
					)
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

			return <React.Fragment>
				<div className="container" style={{maxWidth: "600px"}}>
					<div
						style={{position: "relative"}}
					>
						<Pie data={data} options={options} ref={this.chartRef}/>
						<a
							style={{
								top: "3px",
								right: "0px",
								position: "absolute",
							}}
							href={"data:,"}
							download="chart.png"
							ref={this.downloadRef}
						>
							<Button className="ml-1 btn-sm">
								<FontAwesomeIcon icon={faSave}/>
							</Button>
						</a>
					</div>
				</div>
			</React.Fragment>;
		} else return null;
	}
}

export default PieChart;
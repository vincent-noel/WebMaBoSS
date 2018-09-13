import React from "react";
import ReactDOMServer from "react-dom/server";
import {Line} from "react-chartjs-2";
import LoadingIcon from "../../commons/LoadingIcon";

class MaBossStatesProbTraj extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			statesProbTrajLoaded: false,
			statesProbTraj: undefined,
		};

		this.statesProbTrajChecker = undefined;
		this.chartRef = this.chartRef.bind(this);
		this.legendRef = this.legendRef.bind(this);
		this.legend = undefined;
	}

	chartRef(ref) {
		if (ref !== null) {
			this.legend = ref.chartInstance.generateLegend();
		}
	}

	legendRef(ref) {
		if (ref !== null){
			ref.innerHTML = this.legend;
		}
	}

	getStateProbtraj(simulationId) {
		fetch("/api/maboss/" + simulationId + "/states_trajs/")
		.then(response => {	return response.json(); })
		.then(data => {
			if (data['states_probtraj'] !== null) {
				clearInterval(this.statesProbTrajChecker);
				this.setState({statesProbTrajLoaded: true, statesProbTraj: data['states_probtraj']})
			}
		});
	}


	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({statesProbTrajLoaded: false, statesProbTraj: undefined});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId) {
			this.statesProbTrajChecker = setInterval(() => this.getStateProbtraj(nextProps.simulationId), 1000);
			return true;
		}
		return true;

	}

	componentDidMount() {
		this.statesProbTrajChecker = setInterval(() => this.getStateProbtraj(this.props.simulationId), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.statesProbTrajChecker);
	}

	render() {

		if (this.state.statesProbTrajLoaded) {

			const probtraj = this.state.statesProbTraj;
			let data = {
				labels: Object.keys(Object.values(probtraj)[0]),
				datasets : Object.keys(probtraj).map(
					(key, index) => {
						return {
							label: key,
							data: Object.values(probtraj[key]),
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
				legendCallback: (chart) => {
					return (ReactDOMServer.renderToStaticMarkup(<ul className="chart-legend">
						{
							chart.data.datasets.map((dataset, index) => {
								return <li key={index}>
									<span style={{backgroundColor: dataset.backgroundColor}}></span>
									{dataset.label}
								</li>;
							})
						}
					</ul>))
				}
			};

			return (
				<React.Fragment>
					<Line data={data} options={options} ref={this.chartRef}/>
					<div ref={this.legendRef}></div>
				</React.Fragment>
			);
		} else if (this.props.simulationId !== undefined) {
			return <LoadingIcon width="200px"/>
		} else {
			return <div/>
		}

	}
}

export default MaBossStatesProbTraj;
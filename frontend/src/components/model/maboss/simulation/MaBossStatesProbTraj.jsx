import React from "react";
import ReactDOMServer from "react-dom/server";
import {Line} from "react-chartjs-2";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";
import LineChart from "../../../charts/LineChart";


class MaBossStatesProbTraj extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			statesProbTrajLoaded: false,
			statesProbTraj: null,
		};

		this.statesProbTrajChecker = null;
		this.getStateProbtrajCall = null;

	}

	getStateProbtraj(project_id, simulation_id) {
		this.setState({statesProbTrajLoaded: false, statesProbTraj: null});
		this.getStateProbtrajCall = APICalls.MaBoSSCalls.getStatesProbTraj(project_id, simulation_id);
		this.getStateProbtrajCall.promise.then(data => {
			if (data['status'] === "Finished") {
				clearInterval(this.statesProbTrajChecker);
				this.setState({statesProbTrajLoaded: true, statesProbTraj: data['states_probtraj']})
			}
		});
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({statesProbTrajLoaded: false, statesProbTraj: null});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId) {
			this.getStateProbtrajCall.cancel();
			this.setState({statesProbTrajLoaded: false, statesProbTraj: null});
			this.statesProbTrajChecker = setInterval(
				() => this.getStateProbtraj(nextProps.project, nextProps.simulationId), 1000
			);
			return false;
		}
		return true;

	}

	componentDidMount() {
		this.statesProbTrajChecker = setInterval(
			() => this.getStateProbtraj(this.props.project, this.props.simulationId), 1000
		);
	}

	componentWillUnmount() {
		this.getStateProbtrajCall.cancel();
		clearInterval(this.statesProbTrajChecker);
	}

	render() {

		if (this.state.statesProbTrajLoaded) {
			return <LineChart traj={this.state.statesProbTraj} colormap={this.props.colormap}/>
			// const probtraj = this.state.statesProbTraj;
			// let data = {
			// 	labels: Object.keys(Object.values(probtraj)[0]),
			// 	datasets : Object.keys(probtraj).map(
			// 		(key, index) => {
			// 			return {
			// 				label: key,
			// 				data: Object.values(probtraj[key]),
			// 				fill: false,
            // 				backgroundColor: this.props.colormap[index%this.props.colormap.length],
          	// 				borderColor: this.props.colormap[index%this.props.colormap.length],
			// 			};
			// 		}
			// 	)
			// };
			//
			// let options = {
			// 	legend: {
			// 		display: false,
			//
			// 	},
			// 	legendCallback: (chart) => {
			//
			// 		return (ReactDOMServer.renderToStaticMarkup(<ul className="chart-legend">
			// 			{
			// 				chart.data.datasets.map((dataset, index) => {
			// 					return <li key={index} className={"legend-item d-flex"}>
			// 						<span className={"legend-color"}
			// 							style={{backgroundColor: dataset.backgroundColor}}
			// 						></span>
			// 						<span className={"legend-label align-items-start"}>{dataset.label}</span>
			// 					</li>;
			// 				})
			// 			}
			// 		</ul>));
			// 	}
			// };
			//
			// return (
			// 	<React.Fragment>
			// 		<Line data={data} options={options} ref={this.chartRef}/>
			// 		<div ref={this.legendRef}></div>
			// 	</React.Fragment>
			// );
		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>
		} else {
			return <div/>
		}

	}
}

export default MaBossStatesProbTraj;
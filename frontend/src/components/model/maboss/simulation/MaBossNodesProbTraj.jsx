import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";
import LineChart from "../../../charts/LineChart";


class MaBossNodesProbTraj extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nodesProbTrajLoaded: false,
			nodesProbTraj: null,
		};

		this.nodesProbTrajChecker = null;
		this.getNodesProbtrajCall = null;
	}

	getNodesProbtraj(project_id, simulation_id) {

		this.setState({nodesProbTrajLoaded: false, nodesProbTraj: null});
		this.getNodesProbtrajCall = APICalls.MaBoSSCalls.getNodesProbTraj(project_id, simulation_id);

		this.getNodesProbtrajCall.promise.then(data => {
			if (data['status'] === "Finished") {
				clearInterval(this.nodesProbTrajChecker);
				this.setState({nodesProbTrajLoaded: true, nodesProbTraj: data['nodes_probtraj']})
			}
		});
	}

	componentDidMount() {
		this.nodesProbTrajChecker = setInterval(
			() => this.getNodesProbtraj(this.props.project, this.props.simulationId), 1000
		);
	}

	componentWillUnmount() {
		this.getNodesProbtrajCall.cancel();
		clearInterval(this.nodesProbTrajChecker);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({nodesProbTrajLoaded: false, nodesProbTraj: null});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId) {
			this.getNodesProbtrajCall.cancel();
			this.setState({nodesProbTrajLoaded: false, nodesProbTraj: null});
			this.nodesProbTrajChecker = setInterval(
				() => this.getNodesProbtraj(nextProps.project, nextProps.simulationId), 1000
			);
			return false;
		}
		return true;

	}

	render() {

		if (this.state.nodesProbTrajLoaded) {
			return <LineChart
				traj={this.state.nodesProbTraj}
				colormap={this.props.colormap}
				title={this.props.simulationName}
			/>

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>
		}

	}
}

export default MaBossNodesProbTraj;
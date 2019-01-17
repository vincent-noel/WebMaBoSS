import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";
import PieChart from "../../../charts/PieChart";
import LineChart from "./MaBossNodesProbTraj";

class MaBossFixedPoints extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			fptableLoaded: false,
			fptable: null,
		};

		this.fixedPointsChecker = null;
		this.getFixedPointsCall = null;
	}

	getFixedPoints(project_id, simulation_id) {


		this.setState({fptableLoaded: false, fptable: null});
		this.getFixedPointsCall = APICalls.MaBoSSCalls.getFixedPoints(project_id, simulation_id);
		this.getFixedPointsCall.promise.then(data => {
			if (data['status'] === "Finished") {
				clearInterval(this.fixedPointsChecker);
				this.setState({fptableLoaded: true, fptable: data['fixed_points']})
			}
		});
	}

	componentDidMount() {
		this.fixedPointsChecker = setInterval(() => this.getFixedPoints(this.props.project, this.props.simulationId), 1000);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({fptableLoaded: false, fptable: null});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId && nextProps.simulationId !== null) {
			this.getFixedPointsCall.cancel();
			this.setState({fptableLoaded: false, fptable: null});
			this.fixedPointsChecker = setInterval(() => this.getFixedPoints(nextProps.project, nextProps.simulationId), 1000);
			return false;
		}
		return true;

	}

	componentWillUnmount() {
		this.getFixedPointsCall.cancel();
		clearInterval(this.fixedPointsChecker);
	}

	render() {

		if (this.state.fptableLoaded) {
			return <PieChart table={this.state.fptable} colormap={this.props.colormap} title={this.props.simulationName}/>

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default MaBossFixedPoints;
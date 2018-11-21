import React from "react";
import {Pie} from "react-chartjs-2";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";

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

			const data = {
				labels: Object.keys(this.state.fptable),
				datasets: [{
					data: Object.values(this.state.fptable),
					backgroundColor: Object.values(this.state.fptable).map((value, index) => { return this.props.colormap[index]})
				}]
			};

			const options = {
				legend: {
					position: 'bottom',
				}
			};

			return (
				<Pie data={data} options={options}/>
			);
		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>
		} else {
			return <div/>
		}

	}
}

export default MaBossFixedPoints;
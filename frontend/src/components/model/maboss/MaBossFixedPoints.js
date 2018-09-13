import React from "react";
import {Pie} from "react-chartjs-2";
import LoadingIcon from "../../commons/LoadingIcon";

class MaBossFixedPoints extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			fptableLoaded: false,
			fptable: undefined,
		};

		this.fixedPointsChecker = undefined;


	}

	getFixedPoints(simulationId) {
		fetch("/api/maboss/" + simulationId + "/fixed_points/")
		.then(response => {	return response.json(); })
		.then(data => {
			if (data['fixed_points'] !== null) {
				clearInterval(this.fixedPointsChecker);
				this.setState({fptableLoaded: true, fptable: data['fixed_points']})
			}
		});
	}

	componentDidMount() {
		this.fixedPointsChecker = setInterval(() => this.getFixedPoints(this.props.simulationId), 1000);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({fptableLoaded: false, fptable: undefined});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId && nextProps.simulationId !== null) {
			this.fixedPointsChecker = setInterval(() => this.getFixedPoints(nextProps.simulationId), 1000);
			return true;
		}
		return true;

	}


	componentWillUnmount() {
		clearInterval(this.fixedPointsChecker);
	}


	render() {
		if (this.state.fptableLoaded) {

			const data = {
				labels: Object.values(this.state.fptable['State']),
				datasets: [{
					data: Object.values(this.state.fptable['Proba']),
					backgroundColor: Object.values(this.state.fptable['State']).map((value, index) => { return this.props.colormap[index]})
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
			return <LoadingIcon width="200px"/>
		} else {
			return <div/>
		}

	}
}

export default MaBossFixedPoints;
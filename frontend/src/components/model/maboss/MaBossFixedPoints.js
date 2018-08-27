import React from "react";
import {Pie} from "react-chartjs-2";


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


	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({fptableLoaded: false, fptable: undefined});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId) {
			this.fixedPointsChecker = setInterval(() => this.getFixedPoints(nextProps.simulationId), 1000);
			return true;
		}
		return true;

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
			return (
				<Pie data={data}/>
			);
		} else if (this.props.simulationId !== undefined) {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
		} else {
			return <div/>
		}

	}
}

export default MaBossFixedPoints;
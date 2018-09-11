import React from "react";
import {Line} from "react-chartjs-2";


class MaBossStatesProbTraj extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			statesProbTrajLoaded: false,
			statesProbTraj: undefined,
		};

		this.statesProbTrajChecker = undefined;
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

	render() {

		if (this.state.statesProbTrajLoaded) {

			const probtraj = this.state.statesProbTraj;
			const data = {
				datasets : Object.keys(probtraj).map(
					(key, index) => {
						return {
							label: key,
							data: Object.keys(probtraj[key]).map(
								(key2, index) => { return {x: key2, y: probtraj[key][key2]}; }
							),
							fill: false,
            				backgroundColor: this.props.colormap[index%this.props.colormap.length],
          					borderColor: this.props.colormap[index%this.props.colormap.length],
						};
					}
				)
			};

			const options = {
				legend: {
					position: 'bottom',
				}
			};

			return (
				<Line data={data} options={options}/>
			);
		} else if (this.props.simulationId !== undefined) {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
		} else {
			return <div/>
		}

	}
}

export default MaBossStatesProbTraj;
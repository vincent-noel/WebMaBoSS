import React from "react";
import {Line} from "react-chartjs-2";


class MaBossNodesProbTraj extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nodesProbTrajLoaded: false,
			nodesProbTraj: undefined,
		};

		this.nodesProbTrajChecker = undefined;
	}

	getNodesProbtraj(simulationId) {
		fetch("/api/maboss/" + simulationId + "/nodes_trajs/")
		.then(response => {	return response.json(); })
		.then(data => {
			if (data['nodes_probtraj'] !== null) {
				clearInterval(this.nodesProbTrajChecker);
				this.setState({nodesProbTrajLoaded: true, nodesProbTraj: data['nodes_probtraj']})
			}
		});
	}

	componentWillUnmount() {
		clearInterval(this.nodesProbTrajChecker);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (this.props.modelId !== nextProps.modelId) {
			this.setState({nodesProbTrajLoaded: false, nodesProbTraj: undefined});
			return false;
		}

		if (this.props.simulationId !== nextProps.simulationId) {
			this.nodesProbTrajChecker = setInterval(() => this.getNodesProbtraj(nextProps.simulationId), 1000);
			return true;
		}
		return true;

	}


	render() {

		if (this.state.nodesProbTrajLoaded) {

			const probtraj = this.state.nodesProbTraj;
			const data = {
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

			return (
				<Line data={data}/>
			);
		} else if (this.props.simulationId !== undefined) {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
		} else {
			return <div/>
		}

	}
}

export default MaBossNodesProbTraj;
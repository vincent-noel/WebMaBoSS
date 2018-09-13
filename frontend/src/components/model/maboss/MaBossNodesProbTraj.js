import React from "react";
import {Line} from "react-chartjs-2";
import LoadingIcon from "../../commons/LoadingIcon";


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

	componentDidMount() {
		this.nodesProbTrajChecker = setInterval(() => this.getNodesProbtraj(this.props.simulationId), 1000);
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

			const options = {
				legend: {
					position: 'bottom',
				}
			};

			return (
				<Line data={data} options={options}/>
			);
		} else if (this.props.simulationId !== undefined) {
			return <LoadingIcon width="200px"/>
		} else {
			return <div/>
		}

	}
}

export default MaBossNodesProbTraj;
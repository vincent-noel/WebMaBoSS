import React from "react";
import {Line} from "react-chartjs-2";
import LoadingIcon from "../../../commons/LoadingIcon";
import APICalls from "../../../commons/apiCalls";


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

	getNodesProbtraj(simulationId) {

		this.setState({nodesProbTrajLoaded: false, nodesProbTraj: null});
		this.getNodesProbtrajCall = APICalls.getNodesProbTraj(simulationId)

		this.getNodesProbtrajCall.promise.then(data => {
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
			this.nodesProbTrajChecker = setInterval(() => this.getNodesProbtraj(nextProps.simulationId), 1000);
			return false;
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
		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>
		} else {
			return <div/>
		}

	}
}

export default MaBossNodesProbTraj;
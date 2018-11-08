import React from "react";
import {ReactCytoscape} from 'react-cytoscape';
import LoadingIcon from "../../commons/LoadingIcon";
import APICalls from "../../api/apiCalls";


class ModelGraphRaw extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
		};

		this.getGraphCall = false;

	}

	getGraph(project_id, model_id) {
		// Getting the graph via the API
		this.setState({loaded: false, data: null});
		this.getGraphCall = APICalls.ModelCalls.getGraphRaw(project_id, model_id);

		this.getGraphCall.promise.then(
			data => { this.setState({loaded: true, data: data})}
		)

	}


	componentDidMount() {
		this.getGraph(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		this.getGraphCall.cancel();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.project !== this.props.project) {
			return false;
		}

		if (nextProps.modelId !== this.props.modelId) {
			this.getGraph(nextProps.project, nextProps.modelId);
			return false;

		}
		return true;
	}

	render() {

		if (this.state.loaded) {


			const elements = {
				nodes: Object.values(this.state.data['nodes']).map(
					(name, index) => {
						return {
							data: {
								id: name,
								name: name
							}
						}
					}
				),
				edges: Object.values(this.state.data['edges']).map(
					(values, index) => {
						return {
							data: {
								id: "edge_" + index,
								source: values[0],
								target: values[1]
							},
							classes: values[2] === 1 ?  'positive' : 'negative'
						}
					}
				),

			};

			return (
					<ReactCytoscape containerID="cy"
						elements={elements}
						cyRef={(cy) => { this.cy = window.cy = cy; }}
						cytoscapeOptions={{wheelSensitivity: 0.1}}
						layout={{
							name: 'cola',
							nodeSpacing: 50,
							edgeLengthVal: 200,
							maxSimulationTime: 60000,
						}}
						styleContainer={{
							width: "40rem",
							height: "30rem"
						}}
						style={[
							{
								selector: 'edge.positive',
								style: {
 									'curve-style': 'segments',
									'line-color': '#00ff00',
									'source-arrow-color': '#00ff00',
									'target-arrow-color': '#00ff00',
									'target-arrow-shape': 'triangle'
								},
							}, {
								selector: 'edge.negative',
								style: {
 									'curve-style': 'segments',
									'line-color': '#ff0000',
									'source-arrow-color': '#ff0000',
									'target-arrow-color': '#ff0000',
									'target-arrow-shape': 'tee'
								},
							},{
								selector: 'node',
								style:	{
									'padding-left': 10,
									'padding-right': 10,
									'padding-bottom': 10,
									'padding-top': 10,
									'color': '#000',
									'border-width': 2,
									'border-color': '#000',
									'background-color': '#fff',
									'shape': 'roundrectangle',
									'content': 'data(name)',
									'text-valign': 'center',
									'text-outline-width': 2,
									'text-outline-color': '#fff',
									'width': 'label',
									'height': 'label'
								}
							}
						]}
					/>
			);

		} else {
			return <LoadingIcon width="3rem"/>;
		}

	}
}

export default ModelGraphRaw;
import React from "react";
import {ReactCytoscape} from 'react-cytoscape';
import {getAPIKey} from "../../commons/sessionVariables";

class ModelGraphRaw extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
		};

		this.mounted = false;

	}

	getGraph(modelId) {
		// Getting the graph via the API

		fetch(
			"/api/logical_model/" + modelId + "/graph_raw/",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {	return response.json(); })
		.then(
			data => { this.setState({loaded: true, data: data})}
		)

	}


	componentDidMount() {
		this.mounted = true;
		this.getGraph(this.props.modelId);
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.modelId !== this.props.modelId) {
			this.setState({loaded: false});
			this.getGraph(nextProps.modelId);
			return false;

		}
		return true;
	}

	render() {

		if (this.state.loaded) {

			console.log(this.state.data);

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
			console.log(elements);

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
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />;
		}

	}
}

export default ModelGraphRaw;
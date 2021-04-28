import React from "react";
import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
// import edgeEditing from 'cytoscape-edge-editing';
import CytoscapeComponent from 'react-cytoscapejs';
import LoadingIcon from "../../commons/loaders/LoadingIcon";
import APICalls from "../../api/apiCalls";

Cytoscape.use(COSEBilkent);

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


			const elements = Object.values(this.state.data['nodes']).map(
					(name, index) => {
						return {
							data: {
								id: name,
								label: name,
								name: name
							},
							position: {
								x: 0,
								y: 0
							}
						}
					}
				).concat(Object.values(this.state.data['edges']).map(
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
				));

				console.log(elements);
			// return (
				
				const layout = { 
					name: 'cose-bilkent',   
					quality: 'proof',
					nodeDimensionsIncludeLabels: true,   
					// idealEdgeLength: '1000',
					nodeRepulsion: 100000,
					// gravity: 0.1,
					// animate: 'during',  
					// numIter: 1000,
				};
				const style = {	minWidth: '800px', minHeight: '600px', width: '100%', height: '100%'};
				
				const stylesheet = 
				[
					{
						selector: 'edge.positive',
						style: {
								'curve-style': ' unbundled-bezier',
							'line-color': '#00ff00',
							'source-arrow-color': '#00ff00',
							'target-arrow-color': '#00ff00',
							'target-arrow-shape': 'triangle'
						},
					}, {
						selector: 'edge.negative',
						style: {
								'curve-style': ' unbundled-bezier',
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
				];
				
				return <CytoscapeComponent elements={elements} layout={layout} style={style} stylesheet={stylesheet} zoom={-2}/>;
			// // );
			// const elements = [
			// 	{ data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
			// 	{ data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
			// 	{ data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
			//  ];
		 
			//  return <CytoscapeComponent elements={elements} style={ { width: '600px', height: '600px' } layout } />;
			// return <LoadingIcon width="3rem"/>;
		} else {
			return <LoadingIcon width="3rem"/>;
		}

	}
}

export default ModelGraphRaw;
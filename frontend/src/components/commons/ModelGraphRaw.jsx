import React from "react";
import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
// import edgeEditing from 'cytoscape-edge-editing';
import CytoscapeComponent from 'react-cytoscapejs';
import LoadingIcon from "./loaders/LoadingIcon";
import APICalls from "../api/apiCalls";
import {Button } from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons";

// import konva from 'konva';
// import jquery from 'jquery';
Cytoscape.use(COSEBilkent);
// edgeEditing(Cytoscape, jquery, konva);
class ModelGraphRaw extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
		};

		this.cy = null;
		
		this.getGraphCall = false;
		this.setGraphCall = false;
		this.setNodePosition = false;
		this.setCy = this.setCy.bind(this);
		
		this.layout = { 
			name: 'cose-bilkent',   
			quality: 'proof',
			nodeDimensionsIncludeLabels: true,   
			// idealEdgeLength: '200',
			// edgeElasticity: 1.0,
			// nodeRepulsion: 100000,
			// gravity: 0.1,
			// animate: 'during',  
			// numIter: 1000,
		};
		this.style = {	minWidth: '800px', minHeight: '550px', width: '100%', height: '100%'};
		
	}

	getGraph(project_id, model_id) {
		// Getting the graph via the API
		this.setState({loaded: false, data: null});
		this.getGraphCall = APICalls.ModelCalls.getGraphRaw(project_id, model_id);

		this.getGraphCall.promise.then(
			data => { this.setState({loaded: true, data: data})}
		)
	}
	
	updatePosition(project_id, model_id, node, position) {
		
		this.setNodePosition = APICalls.ModelCalls.updateGraphPosition(project_id, model_id, node, position);
		this.setNodePosition.promise.then(
			(data) => {
				nodes_dict = this.state.data.nodes_dict;
				new_nodes = nodes_dict.reduce((result, t_node) => {
					result.push({
						"name": t_node.name,
						"x": t_node.name === node ? position[0] : t_node.x,
						"y": t_node.name === node ? position[1] : t_node.y
					})
					return result;
				}, {});

				new_data = this.state.data;
				new_data.nodes_dict = new_nodes;
				this.setState({data: data});
			
			}
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
	
	resetLayout() {
		var layout = this.cy.layout(this.layout);

		layout.run();

		// some time later...
		setTimeout(function(){
		  layout.stop();
		}, 1000);
	}

	setCy(cy) {
		this.cy = cy;
		this.cy.on('dragfree', 'node', 
			(node) => {
				console.log(node.target.id() + " position changed");
				this.updatePosition(this.props.project, this.props.modelId, node.target.id(), node.target.position());
			} 
		); 
		
		this.cy.on('zoom', (event)=>{
			console.log("Zoom changed")
			// console.log(event)
		})
		
		this.cy.on('layoutstop', (event) => {
			console.log("Layout stopped")
			// console.log(event);
			// console.log(machin);
			
			let raw_layout = event.layout.idToLNode;
			
			console.log(raw_layout)
			if (raw_layout !== undefined) {
				let new_layout = Object.keys(raw_layout).reduce((result, node)=>{
					result.push({"name": node, "x": raw_layout[node].rect.x, "y": raw_layout[node].rect.y});
					return result;
				}, []);
				
				this.setGraphCall = APICalls.ModelCalls.setGraphPositions(this.props.project, this.props.modelId, new_layout);
			}
			// console.log(new_layout);
		});
		
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
								x: this.state.data['nodes_dict'][index]['x'],
								y: this.state.data['nodes_dict'][index]['y']
							},
							classes: this.props.state !== undefined ? (this.props.state[name] === 1 ? 'positive' : 'negative') : 'default'
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
						selector: 'node.positive',
						style:	{
							'background-color': '#00ff00'
						}
					},{
						selector: 'node.negative',
						style:	{
							'background-color': '#ff0000'	
						}
					},{
						selector: 'node.default',
						style:	{
							'background-color': '#fff'	
						}
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
							'shape': 'roundrectangle',
							'content': 'data(name)',
							'text-valign': 'center',
							'text-outline-width': 2,
							'text-outline-color': '#fff',
							
						}
					}
				];
				// console.log(this.state.data['nodes_dict'])
				return <React.Fragment>
					<Button onClick={()=>{this.resetLayout();}}><FontAwesomeIcon icon={faSyncAlt}/></Button>
					<CytoscapeComponent 
						elements={elements} layout={this.layout }
						style={this.style} stylesheet={stylesheet} cy={(cy) => { this.setCy(cy); }}
					/>
				</React.Fragment>;
		
		} else {
			return <LoadingIcon width="3rem"/>;
		}

	}
}

export default ModelGraphRaw;
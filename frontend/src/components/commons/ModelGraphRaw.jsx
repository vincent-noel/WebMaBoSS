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
import MyDropdown from "./buttons/MyDropdown";
import avsdf from 'cytoscape-avsdf';
import dagre from 'cytoscape-dagre';
import spread from 'cytoscape-spread';
Cytoscape.use( avsdf );
Cytoscape.use( dagre );
// import konva from 'konva';
// import jquery from 'jquery';
Cytoscape.use(COSEBilkent);
Cytoscape.use(spread);
// edgeEditing(Cytoscape, jquery, konva);
class ModelGraphRaw extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
			layout: 'preset',
		};

		this.cy = null;
		
		this.getGraphCall = false;
		this.setGraphCall = false;
		this.setNodePosition = false;
		this.setCy = this.setCy.bind(this);
		this.setLayout = this.setLayout.bind(this);
		
		this.layouts = {
			0: "preset",
			1: "grid",
			2: "circle",
			3: "concentric",
			4: "breadthfirst",
			5: "avsdf",
			6: "dagre",
			7: "spread",
			8: "cose",
			9: 'cose-bilkent'
		}
		
		this.style = {	minWidth: '800px', minHeight: '550px', width: '100%', height: '100%'};
		
	}

	getGraph(project_id, model_id) {
		// Getting the graph via the API
		this.setState({loaded: false, data: null});
		this.getGraphCall = APICalls.ModelCalls.getGraphRaw(project_id, model_id);

		this.getGraphCall.promise.then(
			data => { 
				let preset_layout = Object.values(data.nodes_dict).reduce((result, element) => { return result & (element.x !== undefined);}, true);
				this.setState({loaded: true, data: data, layout:(preset_layout ? "preset" : "dagre")});
			}
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
		})
		
		this.cy.on('layoutstop', (event) => {
			console.log("Layout stopped")
			let raw_layout = event.target.options.eles;
			if (raw_layout !== undefined) {
				let new_layout = Object.values(raw_layout).reduce((result, node)=>{
					
					if (typeof node === 'object' && typeof node.data === "function" && typeof node.position === "function") {
						if (node.data().label !== undefined) {
							result.push({"name": node.data().label, "x": node.position().x, "y": node.position().y});
						}
					}
					return result;
				}, []);
				
				this.setGraphCall = APICalls.ModelCalls.setGraphPositions(this.props.project, this.props.modelId, new_layout);
			}
		});
		
	}
	
	resetLayout() {
		var layout = this.cy.layout({name: this.state.layout});

		layout.run();

		// some time later...
		setTimeout(function(){
		  layout.stop();
		}, 1000);
	}

	
	setLayout(layout) {
		this.setState({layout: layout});
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
						'width': 'label'
						
					}
				}
			];

			return <React.Fragment>
				<Button onClick={()=>{this.resetLayout();}} className="mr-1"><FontAwesomeIcon icon={faSyncAlt}/></Button>
				<MyDropdown
					label={this.state.layout}
					dict={this.layouts}
					callback={ind=>{ this.setLayout(this.layouts[ind]); }} //this.props.onModelChanged(this.props.project, this.props.models[ind].id);}}
					width={"12rem"}
					inline={true}
				/>
				<CytoscapeComponent 
					elements={elements} layout={{name: this.state.layout}}
					style={this.style} stylesheet={stylesheet} cy={(cy) => { this.setCy(cy); }}
				/>
			</React.Fragment>;
	
		} else {
			return <LoadingIcon width="3rem"/>;
		}

	}
}

export default ModelGraphRaw;
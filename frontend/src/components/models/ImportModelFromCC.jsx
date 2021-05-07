import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../api/apiCalls";
import LoadingIcon from "../commons/loaders/LoadingIcon";

class ImportModelFromCC extends React.Component {

	constructor(props) {
		super(props);

		this.getModelsListCall = null;
		
		this.state = {
			data: [],
			loaded: false,
			importing: false
		}
		
		this.loadModel = this.loadModel.bind(this);
		this.loadModelCall = null;
		// this.state = {
		// 	format: 'zginml',
		// 	buttonLabel: "Download",
		// 	showSecondButton: false,
		// 	secondButtonLabel: ""
		// };

		// this.dictFormats = {
		// 	'zginml': "Z-GINML (Extended save)",
		// 	'sbml': "SBML qual",
		// 	'maboss': "MaBoSS"
		// }
	}

	getModelsList() {
		this.getModelsListCall = APICalls.CellCollective.getCellCollectiveList();
		this.getModelsListCall.promise.then(data => this.setState({ data: data, loaded: true }));
	}
	
	componentDidMount() {
		this.getModelsList();
	}
	
	componentWillUnmount() {
		if (this.getModelsListCall !== null) {
			this.getModelsListCall.cancel();
		}
		if (this.loadModelCall !== null) {
			this.loadModelCall.cancel();
		}
	}

	loadModel(model_id, model_name) {
		this.setState({importing: true});
		this.props.showErrors([]);
		let url = APICalls.CellCollective.getSBMLURLFromCC(model_id);
		this.loadModelCall = APICalls.ModelsCalls.importModel(this.props.project, null, model_name, null, url);
		this.loadModelCall.promise.then((response) => {
			if (response.status !== 200) {
				response.json().then((data)=>{
					this.props.showErrors([data['error']]);
					this.props.hide();
				});
					
			} else {
				this.setState({importing: false});
				this.props.hide();
				this.props.updateParent();
			}
		});
	}

	render() {
		return <React.Fragment>
			{ this.state.loaded && !this.state.importing ? 
				<table className="table table-striped">
					<thead>
						<tr>
							<th style={{height: '2.5rem', width: '500px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>Name</th>
							<th style={{height: '2.5rem', width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>Author</th>
						</tr>
					</thead>
					<tbody>{this.state.data.map((element) => {
						return <tr key={element.id} onClick={() => this.loadModel(element.id, element.name)} style={{cursor: 'pointer'}}>
							<td style={{height: '2.5rem', width: '500px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>{element.name}</td>
							<td style={{height: '2.5rem', width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>{element.author}</td>
						</tr>;
					})}
					</tbody>
				</table> : <LoadingIcon width="1rem"/>
			}	
			
		</React.Fragment>;
	}
}

export default ImportModelFromCC;
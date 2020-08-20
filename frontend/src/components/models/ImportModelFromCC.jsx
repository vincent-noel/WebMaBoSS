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
		this.setState({importing: true})
		let url = APICalls.CellCollective.getSBMLURLFromCC(model_id);
		this.loadModelCall = APICalls.ModelsCalls.importModel(this.props.project, null, model_name, null, url);
		this.loadModelCall.promise.then(() => { 
			this.setState({importing: false});
			this.props.hide();
			this.props.updateParent();
		});
	}

	render() {
		return <React.Fragment>
			<Modal style={{minWidth: '600px'}}
				isOpen={this.props.status}
				toggle={() => {
					if (this.props.status) { this.props.hide();}
					else { this.props.show(); }
				}}
			>
				<Card>
					<CardHeader>Import model</CardHeader>
					<CardBody style={{overflowY: "auto", height: '400px', width: '600px', textOverflow: 'ellipsis' }}>
							{ this.state.loaded && !this.state.importing ? 
								<table className="table table-striped">
									<thead>
										<tr>
											<th style={{height: '2.5rem', width: '400px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>Name</th>
											<th style={{height: '2.5rem', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>Author</th>
										</tr>
									</thead>
									<tbody>{this.state.data.map((element) => {
										return <tr key={element.model.id} onClick={() => this.loadModel(element.model.id, element.model.name)}>
											<td style={{height: '2.5rem', width: '400px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>{element.model.name}</td>
											<td style={{height: '2.5rem', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap'}}>{element.model.author}</td>
										</tr>;
							  		})}
									</tbody>
								</table> : <LoadingIcon width="1rem"/>
							}	
						
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="ml-auto" onClick={() => this.props.hide()}>Close</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
			</Modal>
		</React.Fragment>;
	}
}

export default ImportModelFromCC;
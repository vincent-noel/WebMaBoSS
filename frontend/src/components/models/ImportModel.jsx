import React from "react";
import {Button, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import ImportModelFromCC from "./ImportModelFromCC";
import classnames from 'classnames';
import ImportModelsFromBiomodels from "./ImportModelFromBioModels";

class ImportModel extends React.Component {

	constructor(props) {
		super(props);

		// this.getModelsListCall = null;
		
		this.state = {
			activeTab: "biomodels",
		}
		
		// this.loadModel = this.loadModel.bind(this);
		// this.loadModelCall = null;
		
		
		
		this.toggleTab.bind(this);

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
	
	toggleTab(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab });
    	}
	}

	componentDidMount() {
	}
	
	componentWillUnmount() {
	}

	// loadModel(model_id, model_name) {
	// 	this.setState({importing: true})
	// 	let url = APICalls.CellCollective.getSBMLURLFromCC(model_id);
	// 	this.loadModelCall = APICalls.ModelsCalls.importModel(this.props.project, null, model_name, null, url);
	// 	this.loadModelCall.promise.then(() => { 
	// 		this.setState({importing: false});
	// 		this.props.hide();
	// 		this.props.updateParent();
	// 	});
	// }

	render() {
		return <React.Fragment>
			<Modal style={{minWidth: '800px'}}
				isOpen={this.props.status}
				toggle={() => {
					if (this.props.status) { this.props.hide();}
					else { this.props.show(); }
				}}
			>
				<ModalHeader toggle={() => {
					if (this.props.status) { this.props.hide();}
					else { this.props.show(); }
				}}>Import model</ModalHeader>
				<ModalBody>
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: this.state.activeTab === 'biomodels' })}
								onClick={() => { this.toggleTab('biomodels'); }}
							>BioModels</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: this.state.activeTab === 'cellcollective' })}
								onClick={() => { this.toggleTab('cellcollective'); }}
							>CellCollective</NavLink>
						</NavItem>
						
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<br/>
						<TabPane tabId="biomodels" style={{overflowY: "auto", height: '400px', width: '760px', textOverflow: 'ellipsis' }}>
							<ImportModelsFromBiomodels
								project={this.props.project}
								updateParent={this.props.updateParent}
								hide={this.props.hide}
							/>
						</TabPane>
						<TabPane tabId="cellcollective" style={{overflowY: "auto", height: '400px', width: '760px', textOverflow: 'ellipsis' }}>
							<ImportModelFromCC
								project={this.props.project}
								updateParent={this.props.updateParent}
								hide={this.props.hide}
							/>
						</TabPane>
					</TabContent>
				
				</ModalBody>
				<ModalFooter>
					<ButtonToolbar className="d-flex">
						<Button color="danger" className="ml-auto" onClick={() => this.props.hide()}>Close</Button>
					</ButtonToolbar>
				</ModalFooter>
			</Modal>
		</React.Fragment>;
	}
}

export default ImportModel;
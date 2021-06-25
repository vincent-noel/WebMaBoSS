import React from "react";
import {
	Button,
	ButtonToolbar,
	Modal,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Collapse,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink
} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";

import LoadingInlineIcon from "../../../commons/loaders/LoadingInlineIcon";
import Switch from "../../../commons/buttons/Switch";

import "./table-options.scss"
import APICalls from "../../../api/apiCalls";

import classnames from 'classnames';
import TableSwitches from "../../../commons/TableSwitches";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import MyDropdown from "../../../commons/buttons/MyDropdown";

class NewForm extends React.Component {

	static propTypes = {
		   status: PropTypes.bool.isRequired,
		   toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			activeTab: "general",
			name: "",

			outputVariables: null,
			allOutputVariables: false,
			
			candidateVariables: null,
			allCandidateVariables: true,

			singleMutations: {
			   show: false,
			   on: false,
			   off: false
			},

			doubleMutations: {
			   show: false,
			   on: false,
			   off: false,
			},
			initialStates: false,
			rates: false,

			showErrors: true,
		    waitSubmit: false,

			listServers: [],
			serverDropdownOpen: false,
			selectedServerLabel: "Local",
			selectedServer: "-1",
			statusServer: [],

			errors: []
		};

		this.toggleSingleMutations = this.toggleSingleMutations.bind(this);
		this.toggleSingleMutationsOn = this.toggleSingleMutationsOn.bind(this);
		this.toggleSingleMutationsOff = this.toggleSingleMutationsOff.bind(this);

		this.toggleDoubleMutations = this.toggleDoubleMutations.bind(this);
		this.toggleDoubleMutationsOn = this.toggleDoubleMutationsOn.bind(this);
		this.toggleDoubleMutationsOff = this.toggleDoubleMutationsOff.bind(this);

		this.toggleInitialStates = this.toggleInitialStates.bind(this);
		this.toggleRates = this.toggleRates.bind(this);

		this.updateOutputVariables = this.updateOutputVariables.bind(this);
		this.toggleAllOutputVariables = this.toggleAllOutputVariables.bind(this);
	
		this.updateCandidateVariables = this.updateCandidateVariables.bind(this);
		this.toggleAllCandidateVariables = this.toggleAllCandidateVariables.bind(this);
		
		this.getServerStatus = this.getServerStatus.bind(this);
		this.selectServer = this.selectServer.bind(this);
		this.onSubmit = this.onSubmit.bind(this);		
		this.createCall = null;
		this.getSettingsCall = null;
		this.getServersCall = null;
	}

	getServerStatus(id) {
		if (this.state.statusServer[id] === -1) {
			return <LoadingInlineIcon width="1rem" className="float-right" key={"local"}/>;
		}
		if (this.state.statusServer[id] === 1) {
			return <FontAwesomeIcon icon={faCheck} className="float-right" key={"on"}/>;
		}
		if (this.state.statusServer[id] === 0) {
			return <FontAwesomeIcon icon={faTimes} className="float-right" key={"off"}/>;
		}
	}

	buildServersStatus(servers) {
		let serversCalls = new Array(servers.length).fill(null);
		for (let i=0; i < servers.length; i++) {
			serversCalls[i] = APICalls.MaBoSSServerCalls.checkMaBoSSServer(servers[i].id);
			serversCalls[i].promise.then(response => {
				if (response) {
					this.setState(prevState => {
						let t_states = prevState.statusServer;
						t_states[i] = 1;
						return {statusServer: t_states};
					})
				} else {
					this.setState(prevState => {
						let t_states = prevState.statusServer;
						t_states[i] = 0;
						return {statusServer: t_states};
					})
				}
			});
		}
	}

	getServers() {

		this.getServersCall = APICalls.MaBoSSServerCalls.getMaBoSSServers();
		this.getServersCall.promise.then(response => {
			this.buildServersStatus(response);
			this.setState({listServers: response});
		});
	}

	selectServer(ind) {
		this.setState({
			selectedServer: ind, 
			selectedServerLabel: ind === "-1" ? "Local" : [this.state.listServers[ind].desc, ' ', this.getServerStatus[ind]]});
	}

	toggleTab(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab });
    	}
	}

	handleNameChange(name) {
	   this.setState({name: name});
	}

	toggleSingleMutations() {
		this.setState(prevState => { 
			if (prevState.singleMutations.show) {
				return {singleMutations: {...prevState.singleMutations, show: false, on: false, off: false}};
			} else {
				return {singleMutations: {...prevState.singleMutations, show: true}};
			}
		});
	}

	toggleSingleMutationsOn(state) {
		this.setState(prevState => ({singleMutations: {...prevState.singleMutations, on: !prevState.singleMutations.on}}));
	}

	toggleSingleMutationsOff(state) {
		this.setState(prevState => ({singleMutations: {...prevState.singleMutations, off: !prevState.singleMutations.off}}));
	}

	toggleDoubleMutations(state) {
		this.setState(prevState => { 
			if (prevState.doubleMutations.show) {
				return {doubleMutations: {...prevState.doubleMutations, show: false, on: false, off: false}};
			} else {
				return {doubleMutations: {...prevState.doubleMutations, show: true}};
			}
		});
	}

	toggleDoubleMutationsOn(state) {
		this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, on: !prevState.doubleMutations.on}}));
	}

	toggleDoubleMutationsOff(state) {
		this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, off: !prevState.doubleMutations.off}}));
	}

	toggleInitialStates(state) {
		this.setState({initialStates: state});
	}

	toggleRates(state) {
		this.setState({rates: state});
	}

	updateOutputVariables(node) {
		let output_variables = this.state.outputVariables;
		output_variables[node] = !output_variables[node];
		this.setState({outputVariables: output_variables});
	}
	
	toggleAllOutputVariables() {
		let outputs = Object.keys(this.state.outputVariables).reduce(
			(acc, key) => {
				acc[key] = !this.state.allOutputVariables;
				return acc;
			}, {}
		);
		this.setState({allOutputVariables: !this.state.allOutputVariables, outputVariables: outputs});
	}

	updateCandidateVariables(node) {
		let candidate_variables = this.state.candidateVariables;
		candidate_variables[node] = !candidate_variables[node];
		this.setState({candidateVariables: candidate_variables});
	}
	
	toggleAllCandidateVariables() {
		let candidates = Object.keys(this.state.candidateVariables).reduce(
			(acc, key) => {
				acc[key] = !this.state.allCandidateVariables;
				return acc;
			}, {}
		);
		this.setState({allCandidateVariables: !this.state.allCandidateVariables, candidateVariables: candidates});
	}

	
	getSettings(project_id, model_id) {
		if (project_id !== undefined && model_id !== undefined) {

			this.setState({
				candidateVariables: null,
				outputVariables: null,
			});

			this.getSettingsCall = APICalls.MaBoSSCalls.getMaBoSSSimulationSettings(project_id, model_id);
			this.getSettingsCall.promise.then(response => {
				const output_variables = Object.keys(response['output_variables']).reduce(
					(acc, key) => {
						acc[key] = response['output_variables'][key];
						return acc;
					}, {}
				);
				
				const candidate_variables = Object.keys(response['output_variables']).reduce(
					(acc, key) => {
						acc[key] = true;
						return acc;
					}, {}
				);

				this.setState(
				{
					outputVariables: output_variables,
					candidateVariables: candidate_variables
				}
			)})
		}
	}

	onSubmit(e) {
		e.preventDefault();

		let errors = [];

		if (this.state.selectedServer !== "-1" && this.state.statusServer[this.state.selectedServer] !== 1) {
			errors.push("Please select an online MaBoSS server")
		}

		if (!([
			this.state.singleMutations.on, this.state.singleMutations.off,
			this.state.doubleMutations.on, this.state.doubleMutations.off
		].some(element => element))) {
			errors.push("Please select at least one option");
		}
		
		let count_outputs = Object.values(this.state.outputVariables).reduce((result, element) => {
			if (element){
				result++;	
			}		
			return result;
		}, 0);

		if (count_outputs > 15) {
			errors.push("You can only select up to 15 outputs nodes");
		}

		this.setState({errors: errors});

		if (errors.length == 0){

			let server_host, server_port = null;
			if (this.state.selectedServer !== "-1") {
				server_host = this.state.listServers[this.state.selectedServer].host;
				server_port = this.state.listServers[this.state.selectedServer].port;
			}

			this.createCall = APICalls.MaBoSSCalls.createSensitivityAnalysis(this.props.project, this.props.modelId, {
				name: this.state.name,
				singleMutations: {
					on: this.state.singleMutations.on,
					off: this.state.singleMutations.off,
				},
				doubleMutations: {
					on: this.state.doubleMutations.on,
					off: this.state.doubleMutations.off,
				},
				outputVariables: this.state.outputVariables,
				candidateVariables: this.state.candidateVariables,
				serverHost: server_host,
				serverPort: server_port,
			});

			this.createCall.promise.then(response => {
				this.props.submit(this.props.project, response['analysis_id']);
			});
		}
	}

	componentDidMount() {
		if (this.getSettingsCall != null) {
			this.getSettingsCall.cancel();
		}
		this.getSettings(this.props.project, this.props.modelId);
		
		if (this.getServersCall != null) { 
			this.getServersCall.cancel(); 
		}
		this.getServers();
	}

	componentWillUnmount() {
		if (this.getSettingsCall != null) { this.getSettingsCall.cancel(); }
		if (this.createCall != null) { this.createCall.cancel(); }
		if (this.getServersCall != null) { this.getServersCall.cancel(); }
		
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {

		if (nextProps.project !== this.props.project) {
			return false;
		}

		if (nextProps.modelId !== this.props.modelId) {
			if (this.getSettingsCall != null) {
				this.getSettingsCall.cancel();
			}
			this.getSettings(nextProps.project, nextProps.modelId);
			return false;
		}

		return true;

	}

	render() {

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form onSubmit={(e) => this.onSubmit(e)}>
				<Card>
					<CardHeader>New sensitivity analysis</CardHeader>
					<CardBody>
						<ErrorAlert errorMessages={this.state.errors}/>
						<Nav tabs>
								<NavItem>
									<NavLink
									  	className={classnames({ active: this.state.activeTab === 'general' })}
              							onClick={() => { this.toggleTab('general'); }}
									>General</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
									  	className={classnames({ active: this.state.activeTab === 'candidates' })}
              							onClick={() => { this.toggleTab('candidates'); }}
									>Candidates</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
									  	className={classnames({ active: this.state.activeTab === 'outputs' })}
              							onClick={() => { this.toggleTab('outputs'); }}
									>Output</NavLink>
								</NavItem>
						</Nav>
						<TabContent activeTab={this.state.activeTab}>
							<br/>
							<TabPane tabId="general" className="tab-general">

								<div className="form-group general">
									<label htmlFor="name" className="name">Name</label>
									<input type="text" className="form-control large" id="name" placeholder="Name of the simulation"
										   value={this.state.name}
										   onChange={(e) => this.handleNameChange(e.target.value)}
									/>
								</div>

								<ul className="list-options">
									<li className="option">
										<span className="name">Single mutations</span>
										<span className="value">
											<Switch
												checked={this.state.singleMutations.show}
												toggle={this.toggleSingleMutations}
												id={"single_mutations"}
											/>
										</span>
									</li>
									<Collapse isOpen={this.state.singleMutations.show}>
										<li className="sub-option">
											<span className="name">OFF mutations</span>
											<span className="value">
												<Switch
													checked={this.state.singleMutations.off}
													toggle={this.toggleSingleMutationsOff}
													id={"single_mutations_off"}
												/>
											</span>
										</li>
										<li className="sub-option">
											<span className="name">ON mutations</span>
											<span className="value">
												<Switch
													checked={this.state.singleMutations.on}
													toggle={this.toggleSingleMutationsOn}
													id={"single_mutations_on"}
												/>
											</span>
										</li>
									</Collapse>
									<li className="option">
										<span className="name">Double mutations</span>
										<span className="value">
											<Switch
												checked={this.state.doubleMutations.show}
												toggle={this.toggleDoubleMutations}
												id={"double_mutations"}
											/>
										</span>
									</li>
									<Collapse isOpen={this.state.doubleMutations.show}>
										<li className="sub-option">
											<span className="name">OFF mutations</span>
											<span className="value">
												<Switch
													checked={this.state.doubleMutations.off}
													toggle={this.toggleDoubleMutationsOff}
													id={"double_mutations_off"}
												/>
											</span>
										</li>
										<li className="sub-option">
											<span className="name">ON mutations</span>
											<span className="value">
												<Switch
													checked={this.state.doubleMutations.on}
													toggle={this.toggleDoubleMutationsOn}
													id={"double_mutations_on"}
												/>
											</span>
										</li>
									</Collapse>
								</ul>
								<MyDropdown
									dict={this.state.listServers.reduce((result, server, ind)=>{
										result[ind] = [server.desc, ' ', this.getServerStatus(ind)];
										return result;
									}, {"-1": "Local"})}
									label={this.state.selectedServerLabel}
									width="25rem"
									callback={(id) => this.selectServer(id)}
								/>
							</TabPane>
							<TabPane tabId="candidates" className="candidates-outputs">
								{
									this.state.candidateVariables != null ?
									<TableSwitches
										id={"in"}
										type='switch'
										dict={this.state.candidateVariables}
										toggleNode={this.updateCandidateVariables}
										allSwitch={this.state.allCandidateVariables}
										allSwitchToggle={this.toggleAllCandidateVariables}
									/> :
									<LoadingIcon width="3rem"/>
								}
							</TabPane>
							<TabPane tabId="outputs" className="tab-outputs">
								{
									this.state.outputVariables != null ?
									<TableSwitches
										id={"in"}
										type='switch'
										dict={this.state.outputVariables}
										toggleNode={this.updateOutputVariables}
										allSwitch={this.state.allOutputVariables}
										allSwitchToggle={this.toggleAllOutputVariables}
									/> :
									<LoadingIcon width="3rem"/>
								}
							</TabPane>
						</TabContent>
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="mr-auto" onClick={() => this.props.toggle()}>Close</Button>
							<Button
								type="submit" color="default" className="ml-auto"
								disabled={this.state.waitSubmit}
							>Submit {this.state.waitSubmit ? <LoadingInlineIcon width="1rem"/> : null}</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
				</form>
			</Modal>
		);
	}
}

export default NewForm;
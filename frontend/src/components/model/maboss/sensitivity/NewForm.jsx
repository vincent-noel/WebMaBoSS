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
	NavLink,
	DropdownToggle, DropdownMenu, DropdownItem, Dropdown
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
			selectedServer: -1,
			statusServer: [],
		};

		this.toggleSingleMutations = this.toggleSingleMutations.bind(this);
		this.toggleSingleMutationsOn = this.toggleSingleMutationsOn.bind(this);
		this.toggleSingleMutationsOff = this.toggleSingleMutationsOff.bind(this);

		this.toggleDoubleMutations = this.toggleDoubleMutations.bind(this);
		this.toggleDoubleMutationsOn = this.toggleDoubleMutationsOn.bind(this);
		this.toggleDoubleMutationsOff = this.toggleDoubleMutationsOff.bind(this);

		this.toggleInitialStates = this.toggleInitialStates.bind(this);
		this.toggleRates = this.toggleRates.bind(this);
		this.toggleServerDropdown = this.toggleServerDropdown.bind(this);

		this.updateOutputVariables = this.updateOutputVariables.bind(this);

		this.createCall = null;
		this.getSettingsCall = null;
		this.getServersCall = null;
	}

	getServerStatus(id) {
		if (this.state.statusServer[id] === -1) {
			return <LoadingInlineIcon width="1rem" className="ml-auto"/>;
		}
		if (this.state.statusServer[id] === 1) {
			return <FontAwesomeIcon icon={faCheck} className="ml-auto"/>;
		}
		if (this.state.statusServer[id] === 0) {
			return <FontAwesomeIcon icon={faTimes} className="ml-auto"/>;
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
			this.setState({listServers: response});
		});
	}

	selectServer(ind, label) {
		this.setState({selectedServer: ind, selectedServerLabel: label});
	}

	toggleServerDropdown() {
		this.setState({serverDropdownOpen: !this.state.serverDropdownOpen});
	}

	toggleTab(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab });
    	}
	}

	handleNameChange(name) {
	   this.setState({name: name});
	}

	toggleSingleMutations(state) {
		if (state) {
			this.setState(prevState => ({singleMutations: {...prevState.singleMutations, show: true}}));
		} else {
			this.setState(prevState => ({singleMutations: {...prevState.singleMutations, show: false, on: false, off: false}}));
	   	}
	}

	toggleSingleMutationsOn(state) {
		this.setState(prevState => ({singleMutations: {...prevState.singleMutations, on: state}}));
	}

	toggleSingleMutationsOff(state) {
		this.setState(prevState => ({singleMutations: {...prevState.singleMutations, off: state}}));
	}

	toggleDoubleMutations(state) {
       	if (state) {
            this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, show: true}}));
        } else {
			this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, show: false, on: false, off: false}}));
		}
	}

	toggleDoubleMutationsOn(state) {
		this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, on: state}}));
	}

	toggleDoubleMutationsOff(state) {
		this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, off: state}}));
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

	getSettings(project_id, model_id) {

		this.setState({
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

			this.setState(
			{
				outputVariables: output_variables,
			}
		)})
	}

	onSubmit(e) {
		e.preventDefault();


		let server_host, server_port = null;
		if (this.state.selectedServer >= 0) {
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
			serverHost: server_host,
			serverPort: server_port,
		});

		this.createCall.promise.then(response => {
			this.props.submit(this.props.project, response['analysis_id']);
		});

	}

	componentDidMount() {
		this.getSettings(this.props.project, this.props.modelId);
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
			this.getSettingsCall.cancel();
			this.getSettings(nextProps.project, nextProps.modelId);
			return false;
		}

		return true;

	}

	render() {

		const errors = [];

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form onSubmit={(e) => this.onSubmit(e)}>
				<Card>
					<CardHeader>New sensitivity analysis</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={errors}/> : null}

						<Nav tabs>
								<NavItem>
									<NavLink
									  	className={classnames({ active: this.state.activeTab === 'general' })}
              							onClick={() => { this.toggleTab('general'); }}
									>General</NavLink>
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
												updateCallback={this.toggleSingleMutations}
												id={"single_mutations"}
											/>
										</span>
									</li>
									<Collapse isOpen={this.state.singleMutations.show}>
										<li className="sub-option">
											<span className="name">OFF mutations</span>
											<span className="value">
												<Switch
													checked={this.state.singleMutations.on}
													updateCallback={this.toggleSingleMutationsOn}
													id={"single_mutations_on"}
												/>
											</span>
										</li>
										<li className="sub-option">
											<span className="name">ON mutations</span>
											<span className="value">
												<Switch
													checked={this.state.singleMutations.off}
													updateCallback={this.toggleSingleMutationsOff}
													id={"single_mutations_off"}
												/>
											</span>
										</li>
									</Collapse>
									<li className="option">
										<span className="name">Double mutations</span>
										<span className="value">
											<Switch
												checked={this.state.doubleMutations.show}
												updateCallback={this.toggleDoubleMutations}
												id={"double_mutations"}
											/>
										</span>
									</li>
									<Collapse isOpen={this.state.doubleMutations.show}>
										<li className="sub-option">
											<span className="name">OFF mutations</span>
											<span className="value">
												<Switch
													checked={this.state.doubleMutations.on}
													updateCallback={this.toggleDoubleMutationsOn}
													id={"double_mutations_on"}
												/>
											</span>
										</li>
										<li className="sub-option">
											<span className="name">ON mutations</span>
											<span className="value">
												<Switch
													checked={this.state.doubleMutations.off}
													updateCallback={this.toggleDoubleMutationsOff}
													id={"double_mutations_off"}
												/>
											</span>
										</li>
									</Collapse>
								</ul>
								<Dropdown isOpen={this.state.serverDropdownOpen} toggle={this.toggleServerDropdown} className="container-fluid">
									<DropdownToggle style={{width: '25rem'}} caret>{this.state.selectedServerLabel}</DropdownToggle>
									<DropdownMenu style={{width: '25rem'}}>
										<DropdownItem onClick={() => this.selectServer(-1, "Local")}>Local</DropdownItem>
										{
											this.state.listServers.length > 0 ?
												this.state.listServers.map((server, id) => {
													return <DropdownItem key={id} className="d-flex"
														onClick={() => this.selectServer(id, server.desc)}
													>{server.desc}{this.getServerStatus(id)}</DropdownItem>
											}) : null
										}
									</DropdownMenu>
							 	</Dropdown>
							</TabPane>
							<TabPane tabId="outputs" className="tab-outputs">
								{
									this.state.outputVariables != null ?
									<TableSwitches
										id={"in"}
										type='switch'
										dict={this.state.outputVariables}
										updateCallback={this.updateOutputVariables}
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
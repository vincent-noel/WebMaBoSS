import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter, Collapse, TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";

import LoadingInlineIcon from "../../../commons/loaders/LoadingInlineIcon";
import Switch from "../../../commons/buttons/Switch";

import "./table-options.scss"
import APICalls from "../../../api/apiCalls";

import classnames from 'classnames';
import TableSwitches from "../../../commons/TableSwitches";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";

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

		this.createCall = null;
		this.getSettingsCall = null;
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
		});

		this.createCall.promise.then(response => {
			this.props.submit(response['analysis_id']);
		});

	}

	componentDidMount() {
		this.getSettings(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		if (this.getSettingsCall != null) { this.getSettingsCall.cancel(); }
		if (this.createCall != null) { this.createCall.cancel(); }
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
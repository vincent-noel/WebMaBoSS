import React from "react";
import {Nav, NavItem, NavLink, TabPane, TabContent, Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import classnames from 'classnames';
import TableSwitches from "../../../commons/TableSwitches";
import APICalls from "../../../api/apiCalls";
import ErrorAlert from "../../../commons/ErrorAlert";

import "./new-sim-form.scss";
import Switch from "../../../commons/buttons/Switch";

class NewSimForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

			settings: {
				sample_count: 50000,
				max_time: 1000,
				time_tick: .2,
				discrete_time: false,
				use_physrandgen: true,
				seed_pseudorandom: 100,
				statdist_traj_count: 1000,
				statdist_cluster_threshold: 0.98,
				thread_count: 4,

			},

			name: "",

			activeTab: 'general',

			listNodes: [],
			initialStates: {},
			outputVariables: {},
			mutatedVariables: {},

			errors: [],
		};

		this.sampleCountRef = React.createRef();
		this.maxTimeRef = React.createRef();
		this.timeTickRef = React.createRef();
		this.threadCountRef = React.createRef();
		this.pseudoRandomSeedRef = React.createRef();
		this.statdistTrajCountRef = React.createRef();
		this.statdistClusterThresholdRef = React.createRef();

        this.handleDiscreteTimeChange = this.handleDiscreteTimeChange.bind(this);
		this.handlePhysicalRandGen = this.handlePhysicalRandGen.bind(this);

		this.toggleTab.bind(this);

		this.updateInitialState = this.updateInitialState.bind(this);
		this.updateOutputVariables = this.updateOutputVariables.bind(this);
		this.updateMutatedVariables = this.updateMutatedVariables.bind(this);

		this.getSettingsCall = null;
	}

	getSettings(project_id, model_id) {


		this.setState({
			listNodes: [],
			initialStates: {},
			outputVariables: {},
		});

		this.getSettingsCall = APICalls.MaBoSSCalls.getMaBoSSSimulationSettings(project_id, model_id)
		this.getSettingsCall.promise.then(response => {

			const initial_states = Object.keys(response['initial_states']).reduce(
				(acc, key) => {
					acc[key] = response['initial_states'][key]['1']*100;
					return acc;
				}, {}
			);

			const output_variables = Object.keys(response['output_variables']).reduce(
				(acc, key) => {
					acc[key] = response['output_variables'][key] === 1;
					return acc;
				}, {}
			);

			const mutated_variables = Object.keys(response['initial_states']).reduce(
				(acc, key) => {

					if (Object.keys(response['initial_states']).includes(key)) {
						if (response['initial_states'][key] === 'OFF') acc[key] = -1;
						else if (response['initial_states'][key] === 'ON') acc[key] = 1;
						else acc[key] = 0;

					} else {
						acc[key] = 0

					}
					return acc;
				}, {}
			);

			this.setState(
			{
				outputVariables: output_variables,
				initialStates: initial_states,
				listNodes: Object.keys(response['initial_states']),
				mutatedVariables: mutated_variables,
				settings: response['settings']
			}
		)})
	}

	updateInitialState(node, value) {
		let initial_states = this.state.initialStates;
		initial_states[node] = value;
		this.setState({initialStates: initial_states});
	}

	updateOutputVariables(node) {
		let output_variables = this.state.outputVariables;
		output_variables[node] = !output_variables[node];
		this.setState({outputVariables: output_variables});
	}

	updateMutatedVariables(node, value) {
		let mutated_variables = this.state.mutatedVariables;
		mutated_variables[node] = value;
		this.setState({mutatedVariables: mutated_variables});
	}

	handleNameChange(e) {
		const value = e.target.value;
		this.setState(prevState => ({name: value}));
	}

	handleSampleCountChange(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, sample_count: value}}));
	}

	handleThreadCountChange(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, thread_count: value}}));
	}

	handleDiscreteTimeChange(value) {
		this.setState(prevState => ({settings: {...prevState.settings, discrete_time: value}}))
	}

	handleMaxTimeChange(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, max_time: value}}));
	}

	handleTimeTickChange(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, time_tick: value}}));
	}

	handlePhysicalRandGen(value) {
		this.setState(prevState => ({settings: {...prevState.settings, use_physrandgen: value}}));
	}

	handlePseudoRandomSeed(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, seed_pseudorandom: value}}));
	}

	handleStatdistTrajCount(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, statdist_traj_count: value}}));
	}

	handleStatdistClusterThreshold(e) {
		const value = e.target.value;
		this.setState(prevState => ({settings: {...prevState.settings, statdist_cluster_threshold: value}}));
	}

	toggleTab(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab });
    	}
	}

	onSubmit(e) {
		e.preventDefault();
		const errors = [];

		if (!Object.values(this.state.outputVariables).some(x => x === true)) {
			errors.push("Please select at least one output variable");
		}

		if (!this.state.settings.sample_count) {
			errors.push("Please provide a value for the sample count");
			this.sampleCountRef.current.focus();

		} else if (isNaN(this.state.settings.sample_count)) {
			errors.push("Please provide a valid value for the sample count");
			this.sampleCountRef.current.focus();
		}

		if (!this.state.settings.max_time) {
			errors.push("Please provide a value for the maximum time");
			this.maxTimeRef.current.focus();

		} else if (isNaN(this.state.settings.max_time)) {
			errors.push("Please provide a valid value for the maximum time");
			this.maxTimeRef.current.focus();

		}

		if (!this.state.settings.time_tick) {
			errors.push("Please provide a value for the time tick");
			this.timeTickRef.current.focus();

		} else if (isNaN(this.state.settings.time_tick)) {
			errors.push("Please provide a valid value for the time tick");
			this.timeTickRef.current.focus();

		}


		this.setState({errors: errors});

		if (errors.length === 0) {

			const initial_states = Object.keys(this.state.initialStates).reduce(
					(acc, key) => {
						acc[key] = this.state.initialStates[key]/100;
						return acc;
					}, {}
				);

			const mutations = Object.keys(this.state.mutatedVariables).reduce(
				(acc, key) => {
					if (this.state.mutatedVariables[key] === -1) {
						acc[key] = "OFF";
					} else if (this.state.mutatedVariables[key] === 1) {
						acc[key] = "ON";
					}
					return acc;
				}, {}

			);

			this.props.onSubmit(
				this.props.project, this.props.modelId,
				{
					name: this.state.name,
					settings: this.state.settings,
					initialStates: initial_states,
					outputVariables: this.state.outputVariables,
					mutations: mutations,
				}
			);
		}
	}

	componentDidMount() {
		this.getSettings(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		if (this.getSettingsCall !== null) this.getSettingsCall.cancel();
	}

	shouldComponentUpdate(nextProps, nextState) {

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
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Create new simulation</CardHeader>
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
									  	className={classnames({ active: this.state.activeTab === 'initial_states' })}
              							onClick={() => { this.toggleTab('initial_states'); }}
									>Initial states</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
									  	className={classnames({ active: this.state.activeTab === 'output_variables' })}
              							onClick={() => { this.toggleTab('output_variables'); }}
									>Output</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
									  	className={classnames({ active: this.state.activeTab === 'mutated_variables' })}
              							onClick={() => { this.toggleTab('mutated_variables'); }}
									>Mutations</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab}>
								<br/>
								<TabPane tabId="general" className="tab-general">
									<div className="form-group general">
										<label htmlFor="name" className="name">Name</label>
										<input type="text" className="form-control large" id="name" placeholder="Name of the simulation"
											   value={this.state.name} ref={this.nameRef}
											   onChange={(e) => this.handleNameChange(e)}
										/>
									</div>
									<div className="form-group general">
										<label htmlFor="maxTime" className="name">Max time</label>
										<input type="number" className="form-control" id="maxTime" placeholder="100"
											   value={this.state.settings.max_time} ref={this.maxTimeRef}
											   onChange={(e) => this.handleMaxTimeChange(e)}
										/>
									</div>
									<div className="form-group general">
										<label htmlFor="timeTick" className="name">Time tick</label>
										<input type="number" className="form-control" id="timeTick" placeholder="1"
											   value={this.state.settings.time_tick} ref={this.timeTickRef}
											   onChange={(e) => this.handleTimeTickChange(e)}
										/>
									</div>
										<div className="form-group general">
										<label htmlFor="sampleCount" className="name">Sample count</label>
										<input type="number" className="form-control" id="sampleCount" placeholder="1000"
										   value={this.state.settings.sample_count} ref={this.sampleCountRef}
										   onChange={(e) => this.handleSampleCountChange(e)}
										/>
									</div>
									<div className="form-group general">
										<label htmlFor="threadCount" className="name">Thread count</label>
										<input type="number" className="form-control" id="threadCount" placeholder="4"
										   value={this.state.settings.thread_count} ref={this.threadCountRef}
										   onChange={(e) => this.handleThreadCountChange(e)}
										/>
									</div>
									<div className="form-group general">
										<label htmlFor="discreteTime" className="name">Discrete time</label>
										<Switch checked={this.state.settings.discrete_time} updateCallback={this.handleDiscreteTimeChange} id={"discreteTime"}/>
									</div>
									<div className="form-group general">
										<label htmlFor="physicalRandGen" className="name">Use physical random generator</label>
										<Switch checked={this.state.settings.use_physrandgen} updateCallback={this.handlePhysicalRandGen} id={"physicalRandGen"}/>
									</div>
									<div className="form-group general">
										<label htmlFor="pseudoRandomSeed" className="name">Pseudorandom seed</label>
										<input type="number" className="form-control" id="pseudoRandomSeed" placeholder="100"
										   value={this.state.settings.seed_pseudorandom} ref={this.pseudoRandomSeedRef}
										   onChange={(e) => this.handlePseudoRandomSeed(e)}
										/>
									</div>
									<div className="form-group general">
										<label htmlFor="statdistTrajCount" className="name">Statdist Traj Count</label>
										<input type="number" className="form-control" id="statdistTrajCount" placeholder="1000"
										   value={this.state.settings.statdist_traj_count} ref={this.statdistTrajCountRef}
										   onChange={(e) => this.handleStatdistTrajCount(e)}
										/>
									</div>
									<div className="form-group general">
										<label htmlFor="statdistClusterThreshold" className="name">Statdist Cluster Threshold</label>
										<input type="number" className="form-control" id="statdistClusterThreshold" placeholder="0.98"
										   value={this.state.settings.statdist_cluster_threshold} ref={this.statdistClusterThresholdRef}
										   onChange={(e) => this.handleStatdistClusterThreshold(e)}
										/>
									</div>
								</TabPane>
								<TabPane tabId="initial_states">
									<TableSwitches
										id={"is"}
										type='range'
										dict={this.state.initialStates}
										updateCallback={this.updateInitialState}
									/>
								</TabPane>
								<TabPane tabId="output_variables">
									<TableSwitches
										id={"in"}
										type='switch'
										dict={this.state.outputVariables}
										updateCallback={this.updateOutputVariables}
									/>
								</TabPane>
								<TabPane tabId="mutated_variables">
									<TableSwitches
										id={"mv"}
										type='3pos'
										dict={this.state.mutatedVariables}
										updateCallback={this.updateMutatedVariables}
									/>
								</TabPane>
							</TabContent>
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {this.props.toggle();}}>Close</Button>
								<Button type="submit" color="default" className="ml-auto">Submit</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default NewSimForm;
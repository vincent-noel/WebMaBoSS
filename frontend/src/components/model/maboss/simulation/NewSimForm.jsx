import React from "react";
import {Nav, NavItem, NavLink, TabPane, TabContent, Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import classnames from 'classnames';
import TableSwitches from "../../../commons/TableSwitches";
import APICalls from "../../../api/apiCalls";


class NewSimForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			sampleCount: 1000,
			maxTime: 50,
			timeTick: 1,

			activeTab: 'general',

			listNodes: [],
			initialStates: {},
			outputVariables: {},
			mutatedVariables: {}
		};

		this.handleSampleCountChange.bind(this);
		this.handleMaxTimeChange.bind(this);
		this.handleTimeTickChange.bind(this);

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
				mutatedVariables: mutated_variables
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

	handleSampleCountChange(e) {
		this.setState({sampleCount: e.target.value});
	}

	handleMaxTimeChange(e) {
		this.setState({maxTime: e.target.value});
	}

	handleTimeTickChange(e) {
		this.setState({timeTick: e.target.value});
	}

	toggleTab(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab });
    	}
	}

	onSubmit(e) {
		e.preventDefault();

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
				sampleCount: this.state.sampleCount,
				maxTime: this.state.maxTime,
				timeTick: this.state.timeTick,
				initialStates: initial_states,
				outputVariables: this.state.outputVariables,
				mutations: mutations,
			}
		);
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
								<TabPane tabId="general">
									<div className="form-group row">
										<label htmlFor="sampleCount" className="col-sm-2 col-form-label">Sample count</label>
										<div className="col-sm-10">
											<input type="numbers" className="form-control" id="sampleCount" placeholder="1000"
												   value={this.state.sampleCount} onChange={(e) => this.handleSampleCountChange(e)}
											/>
										</div>
									</div>
									<div className="form-group row">
										<label htmlFor="maxTime" className="col-sm-2 col-form-label">Max time</label>
										<div className="col-sm-10">
											<input type="number" className="form-control" id="maxTime" placeholder="100"
												   value={this.state.maxTime} onChange={(e) => this.handleMaxTimeChange(e)}
											/>
										</div>
									</div>
									<div className="form-group row">
										<label htmlFor="timeTick" className="col-sm-2 col-form-label">Time tick</label>
										<div className="col-sm-10">
											<input type="number" className="form-control" id="timeTick" placeholder="1"
												   value={this.state.timeTick} onChange={(e) => this.handleTimeTickChange(e)}
											/>
										</div>
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
import React from "react";
import {Nav, NavItem, NavLink, TabPane, TabContent, Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import classnames from 'classnames';
import {getAPIKey} from "../../commons/sessionVariables";
import TableSwitches from "../../commons/TableSwitches";


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
			internalVariables: {},
		};

		this.handleSampleCountChange.bind(this);
		this.handleMaxTimeChange.bind(this);
		this.handleTimeTickChange.bind(this);

		this.toggleTab.bind(this);

		this.updateInitialState = this.updateInitialState.bind(this);
		this.updateInternalVariables = this.updateInternalVariables.bind(this);
	}

	getSettings() {
		const conf = {
		  method: "get",
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
		  })
		};

		fetch("/api/logical_model/" + this.props.project + "/" + this.props.modelId + "/maboss/settings/", conf)
		.then(response => response.json())
		.then(response => {

			const initial_states = Object.keys(response['initial_states']).reduce(
				(acc, key) => {
					acc[key] = response['initial_states'][key]['1'];
					return acc;
				}, {}
			);

			const internal_variables = Object.keys(response['internal_variables']).reduce(
				(acc, key) => {
					acc[key] = response['internal_variables'][key] === 1;
					return acc;
				}, {}
			);
			this.setState(
			{
				internalVariables: internal_variables,
				initialStates: initial_states,
				listNodes: Object.keys(response['initial_states'])
			}
		)})
	}

	updateInitialState(node, value) {
		let initial_states = this.state.initialStates;
		initial_states[node] = value;
		this.setState({initialStates: initial_states});
	}

	updateInternalVariables(node) {
		let internal_variables = this.state.internalVariables;
		internal_variables[node] = !internal_variables[node];
		this.setState({internalVariables: internal_variables});
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

		this.props.onSubmit({
			sampleCount: this.state.sampleCount,
			maxTime: this.state.maxTime,
			timeTick: this.state.timeTick,
			initialStates: this.state.initialStates,
			internalVariables: this.state.internalVariables,
		});
	}

	componentDidMount() {
		this.getSettings();
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
									  	className={classnames({ active: this.state.activeTab === 'internal_variables' })}
              							onClick={() => { this.toggleTab('internal_variables'); }}
									>Internal variables</NavLink>
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
								<TabPane tabId="internal_variables">
									<TableSwitches
										id={"in"}
										type='switch'
										dict={this.state.internalVariables}
										updateCallback={this.updateInternalVariables}
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
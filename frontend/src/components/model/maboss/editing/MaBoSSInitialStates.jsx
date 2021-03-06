import React from "react";

import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";

import "./table-initial-states.scss";
import BufferedRange from "../../../commons/buttons/BufferedRange";
import {Button, ButtonToolbar} from "reactstrap";
import TableSwitches from "../../../commons/TableSwitches";
import { unique } from "jquery";

class MaBoSSInitialStates extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			initialStates: {},
			updatingInitialStates: {},
			rawInitialStates: {},
			allInitialStates: 50.0,
			allUpdating: false,
		};

		this.getInitialStatesCall = null;
		this.saveInitialStatesCall = null;
		
		this.setAllInitialVariables = this.setAllInitialVariables.bind(this);
		this.updateInitialState = this.updateInitialState.bind(this);
	}

	loadInitialStates(project_id, model_id) {
		this.getInitialStatesCall = APICalls.MaBoSSCalls.getMaBoSSInitialStates(project_id, model_id)
		this.getInitialStatesCall.promise.then(response => {

			const initial_states = Object.keys(response['initial_states']).reduce(
				(acc, key) => {

					acc[key] = parseFloat(response['initial_states'][key]['1']) * 100;
					// acc[key] = response['initial_states'][key]['1'] * 100;
					return acc;
				}, {}
			);
			const updating_initial_states = Object.keys(response['initial_states']).reduce(
				(acc, key) => {
					acc[key] = false;
					return acc;
				}, {}
			);
			// console.log(updatingInitialStates)
			
			let unique_values = Object.values(initial_states).filter((x, i, a) => a.indexOf(x) == i)

			this.setState({
				initialStates: initial_states, updatingInitialStates: updating_initial_states, 
				rawInitialStates: response['initial_states'], 
				allInitialStates: unique_values.length > 1 ? 50.0 : unique_values[0]
			});
		});
	}

	setAllInitialVariables(value) {
		if (this.saveInitialStatesCall !== null) {
			this.saveInitialStatesCall.cancel();
		}

		let updating = this.state.updatingInitialStates;
		Object.keys(this.state.updatingInitialStates).map(element => {
			updating[element] = true;
		});
		// updating[name] = true;
		this.setState({allUpdating: true, updatingInitialStates: updating});

		const initial_states = this.state.initialStates;
		Object.keys(this.state.updatingInitialStates).map(element => {
			initial_states[element] = value;
		});
		
		const initial_states_post = Object.keys(initial_states).reduce(
			(acc, key) => {
				let new_value = this.state.initialStates[key]/100;
				let old_value = parseFloat(this.state.rawInitialStates[key]['1']);
				if (new_value !== old_value && !isNaN(old_value) && !isNaN(new_value)) {
					acc[key] = {
						"0": (1.0-this.state.initialStates[key]/100).toString(),
						"1": (this.state.initialStates[key]/100).toString()
					};
				} else {
					acc[key] = this.state.rawInitialStates[key];
				}
				return acc;
			}, {}
		);

		this.saveInitialStatesCall = APICalls.MaBoSSCalls.saveMaBoSSInitialStates(
			this.props.project, this.props.modelId, initial_states_post);

		this.saveInitialStatesCall.promise.then((response) => {
			if (response.status === 200) {


				let updating = this.state.updatingInitialStates;
				Object.keys(this.state.updatingInitialStates).map(element => {
					updating[element] = false;
				});
				this.setState({initialStates: initial_states, allInitialStates: value, updatingInitialStates: updating, allUpdating: false});
			}
		});
	}
	
	updateInitialState(name, value) {

		if (this.saveInitialStatesCall !== null) {
			this.saveInitialStatesCall.cancel();
		}

		let updating = this.state.updatingInitialStates;
		updating[name] = true;
		this.setState({updatingInitialStates: updating});

		const initial_states = this.state.initialStates;
		initial_states[name] = value;

		const initial_states_post = Object.keys(initial_states).reduce(
			(acc, key) => {
				let new_value = this.state.initialStates[key]/100;
				let old_value = parseFloat(this.state.rawInitialStates[key]['1']);
				if (new_value !== old_value && !isNaN(old_value) && !isNaN(new_value)) {
					acc[key] = {
						"0": (1.0-this.state.initialStates[key]/100).toString(),
						"1": (this.state.initialStates[key]/100).toString()
					};
				} else {
					acc[key] = this.state.rawInitialStates[key];
				}
				return acc;
			}, {}
		);

		this.saveInitialStatesCall = APICalls.MaBoSSCalls.saveMaBoSSInitialStates(
			this.props.project, this.props.modelId, initial_states_post);

		this.saveInitialStatesCall.promise.then((response) => {
			if (response.status === 200) {


				let updating = this.state.updatingInitialStates;
				updating[name] = false;
				this.setState({initialStates: initial_states, updatingInitialStates: updating});
			}
		});
	}

	componentDidMount() {
		this.loadInitialStates(this.props.project, this.props.modelId)
	}

	componentWillUnmount() {
		if (this.getInitialStatesCall !== null) {
			this.getInitialStatesCall.cancel();
		}

		if (this.saveInitialStatesCall !== null) {
			this.saveInitialStatesCall.cancel();
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.project !== this.props.project || nextProps.modelId !== this.props.modelId) {
			this.loadInitialStates(nextProps.project, nextProps.modelId);
			return false;
		}

		return true;
	}


	render() {

		return (
			<React.Fragment>
				<TableSwitches
					id={"is"}
					type='bufferedrange'
					dict={this.state.initialStates}
					updating={this.state.updatingInitialStates}
					updateCallback={this.updateInitialState}
					height={"100%"}
					allSwitch={this.state.allInitialStates}
					allSwitchToggle={this.setAllInitialVariables}
					allUpdating={this.state.allUpdating}
				/>
				{/* <ul className="list-initial-states">
				{
					this.state.initialStates !== null ?
					Object.keys(this.state.initialStates).map((name, index) => {
						return (
							<li key={index}>
								<table className="table-initial-states">
									<thead>
									<tr className={"d-flex"}>
										<th className={"flex-fill name align-items-center"}>{name}</th>
										<th className={"actions d-flex align-items-center"}>
											<BufferedRange
												value={this.state.initialStates[name]} id={"initial_state_" + index}
											   	updateCallback={(value) => this.updateInitialState(name, value)}
												buffer={50} waiting={this.state.updatingInitialStates[name]}
										   	/>
										</th>
										<th className={"d-flex align-items-center"}>
											<ButtonToolbar>
												<Button className="ml-1 btn-sm" onClick={() => this.updateInitialState(name, 50)}>Random</Button>
											</ButtonToolbar>
										</th>
									</tr>
									</thead>

								</table>
							</li>
						);
					}) :
					<LoadingIcon width="3rem"/>
				}
			</ul> */}
			</React.Fragment>
		);
	}
}

export default MaBoSSInitialStates;
import React from "react";

import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";

import "./table-initial-states.scss";
import BufferedRange from "../../../commons/buttons/BufferedRange";


class MaBoSSInitialStates extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			initialStates: {}
		};

		this.getInitialStatesCall = null;
		this.saveInitialStatesCall = null;
	}

	loadInitialStates(project_id, model_id) {
		this.getInitialStatesCall = APICalls.MaBoSSCalls.getMaBoSSInitialStates(project_id, model_id)
		this.getInitialStatesCall.promise.then(response => {

			const initial_states = Object.keys(response['initial_states']).reduce(
				(acc, key) => {
					acc[key] = response['initial_states'][key]['1'] * 100;
					return acc;
				}, {}
			);
			this.setState({initialStates: initial_states});
		});
	}

	updateInitialState(name, value) {

		if (this.saveInitialStatesCall !== null) {
			this.saveInitialStatesCall.cancel();
		}

		const initial_states = this.state.initialStates;
		initial_states[name] = value;

		const initial_states_post = Object.keys(initial_states).reduce(
			(acc, key) => {
				acc[key] = initial_states[key]/100;
				return acc;
			}, {}
		);

		this.saveInitialStatesCall = APICalls.MaBoSSCalls.saveMaBoSSInitialStates(
			this.props.project, this.props.modelId, initial_states_post);

		this.saveInitialStatesCall.promise.then((response) => {
			if (response.status === 200) {
				this.setState({initialStates: initial_states});
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

	render() {

		return (
			<React.Fragment>
				<ul className="list-initial-states">
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
												buffer={50}
										   	/>
										</th>
									</tr>
									</thead>

								</table>
							</li>
						);
					}) :
					<LoadingIcon width="3rem"/>
				}
			</ul>
			</React.Fragment>
		);
	}
}

export default MaBoSSInitialStates;
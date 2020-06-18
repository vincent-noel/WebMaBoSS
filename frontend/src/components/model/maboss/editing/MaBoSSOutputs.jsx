import React from "react";

import APICalls from "../../../api/apiCalls";

import "./table-initial-states.scss";
import TableSwitches from "../../../commons/TableSwitches";
import Switch from "../../../commons/buttons/Switch";


class MaBoSSOutputs extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			allOutputVariables: false,
			outputVariables: {},
		};

		this.updateOutputVariable = this.updateOutputVariable.bind(this);
		this.updateAllOutputVariables = this.updateAllOutputVariables.bind(this);

		this.getOutputVariablesCall = null;
		this.setOutputVariablesCall = null;
	}

	loadOutputs(project_id, model_id) {
		this.getOutputVariablesCall = APICalls.MaBoSSCalls.getMaBoSSModelOutputs(project_id, model_id)
		this.getOutputVariablesCall.promise.then(response => {
			this.setState({outputVariables: response['outputs']});
		});
	}

	updateAllOutputVariables(value) {
		let outputs = Object.keys(this.state.outputVariables).reduce(
			(acc, key) => {
				acc[key] = value;
				return acc;
			}, {}
		);
		this.setOutputVariablesCall = APICalls.MaBoSSCalls.setMaBoSSModelOutputs(this.props.project, this.props.modelId, outputs);
		this.setOutputVariablesCall.promise.then(response => {
			if (response.status === 200) {
				console.log("Updating variables");
				console.log(outputs);
				this.setState({outputVariables: outputs});
			}
		})
	}

	updateOutputVariable(name, value) {
		let outputs = this.state.outputVariables;
		outputs[name] = value;
		this.setOutputVariablesCall = APICalls.MaBoSSCalls.setMaBoSSModelOutputs(this.props.project, this.props.modelId, outputs);
		this.setOutputVariablesCall.promise.then(response => {

			if (response.status === 200) {
				console.log("Updating one variable")
				console.log(outputs)
				this.setState({outputVariables: outputs});
			}
		})
	}

	componentDidMount() {
		this.loadOutputs(this.props.project, this.props.modelId)
	}

	componentWillUnmount() {
		if (this.getOutputVariablesCall !== null) {
			this.getOutputVariablesCall.cancel();
		}

		if (this.setOutputVariablesCall !== null) {
			this.setOutputVariablesCall.cancel();
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.project !== this.props.project || nextProps.modelId !== this.props.modelId) {
			this.loadOutputs(nextProps.project, nextProps.modelId);
			return false;
		}

		return true;
	}


	render() {

		return (
			<React.Fragment>
				{/*<div className="container">*/}
				{/*	<table className="table" style={{width: '100%'}}>*/}
				{/*		<tbody>*/}
				{/*			<tr key={"all"}>*/}
				{/*				<td >All</td>*/}
				{/*				<td className="d-flex justify-content-end">*/}
				{/*					<Switch*/}
				{/*						id={"in-all"}*/}
				{/*						updateCallback={(value) => {this.updateAllOutputVariables(value)}}*/}
				{/*						updateAllOutputVariableschecked={this.state.allOutputVariables}*/}
				{/*					/>*/}
				{/*				</td>*/}
				{/*			</tr>*/}
				{/*		</tbody>*/}
				{/*	</table>*/}
				{/*</div>*/}
				<TableSwitches
					id={"in"}
					type='switch'
					dict={this.state.outputVariables}
					updateCallback={this.updateOutputVariable}
					height={"100%"}
					allSwitch={this.state.allOutputVariables}
					allSwitchCallback={this.updateAllOutputVariables}
				/>
			</React.Fragment>
		);
	}
}

export default MaBoSSOutputs;
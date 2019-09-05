import React from "react";

import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";

import "./table-initial-states.scss";
import {Button, ButtonToolbar} from "reactstrap";
import TableSwitches from "../../../commons/TableSwitches";


class MaBoSSOutputs extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			outputVariables: {},
		};

		this.updateOutputVariable = this.updateOutputVariable.bind(this);

		this.getOutputVariablesCall = null;
		this.setOutputVariablesCall = null;
	}

	loadOutputs(project_id, model_id) {
		this.getOutputVariablesCall = APICalls.MaBoSSCalls.getMaBoSSModelOutputs(project_id, model_id)
		this.getOutputVariablesCall.promise.then(response => {
			this.setState({outputVariables: response['outputs']});
		});
	}

	updateOutputVariable(name, value) {
		let outputs = this.state.outputVariables;
		outputs[name] = value;
		this.setOutputVariablesCall = APICalls.MaBoSSCalls.setMaBoSSModelOutputs(this.props.project, this.props.modelId, outputs);
		this.setOutputVariablesCall.promise.then(response => {
			if (response.status === 200) {
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
				<TableSwitches
					id={"in"}
					type='switch'
					dict={this.state.outputVariables}
					updateCallback={this.updateOutputVariable}
					height={"100%"}
				/>
			</React.Fragment>
		);
	}
}

export default MaBoSSOutputs;
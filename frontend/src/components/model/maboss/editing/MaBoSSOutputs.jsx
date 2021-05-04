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

		this.toggleVariable = this.toggleVariable.bind(this);
		this.toggleAllOutputVariables = this.toggleAllOutputVariables.bind(this);

		this.getOutputVariablesCall = null;
		this.setOutputVariablesCall = null;
	}

	loadOutputs(project_id, model_id) {
		this.getOutputVariablesCall = APICalls.MaBoSSCalls.getMaBoSSModelOutputs(project_id, model_id)
		this.getOutputVariablesCall.promise.then(response => {
			let allOutputs = Object.values(response['outputs']).every((value)=>value);
			this.setState({outputVariables: response['outputs'], allOutputVariables: allOutputs});
		});
	}
	
	toggleAllOutputVariables() {
		let outputs = Object.keys(this.state.outputVariables).reduce(
			(acc, key) => {
				acc[key] = !this.state.allOutputVariables;
				return acc;
			}, {}
		);
		this.setOutputVariablesCall = APICalls.MaBoSSCalls.setMaBoSSModelOutputs(this.props.project, this.props.modelId, outputs);
		this.setOutputVariablesCall.promise.then(response => {
			if (response.status === 200) {
				console.log("Updating variables");
				console.log(outputs);
				this.setState({allOutputVariables: !this.state.allOutputVariables, outputVariables: outputs});
			}
		})
	}

	toggleVariable(name) {
		let outputs = this.state.outputVariables;
		outputs[name] = !outputs[name];
		this.setOutputVariablesCall = APICalls.MaBoSSCalls.setMaBoSSModelOutputs(this.props.project, this.props.modelId, outputs);
		this.setOutputVariablesCall.promise.then(response => {

			if (response.status === 200) {
				console.log("Updating one variable")
				console.log(outputs)
				this.setState({
					outputVariables: outputs, 
					allOutputVariables: (this.state.allOutputVariables && outputs[name])
				});
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
					toggleNode={this.toggleVariable}
					height={"100%"}
					allSwitch={this.state.allOutputVariables}
					allSwitchToggle={this.toggleAllOutputVariables}
				/>
			</React.Fragment>
		);
	}
}

export default MaBoSSOutputs;
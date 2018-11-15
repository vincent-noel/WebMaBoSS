import React from "react";
import {Button} from "reactstrap";

import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/LoadingIcon";

import "./table-parameters.scss";
import SimpleEditButton from "../../../commons/buttons/SimpleEditButton";
import SimpleDeleteButton from "../../../commons/buttons/SimpleDeleteButton";

import MaBoSSValueForm from "./MaBoSSValueForm";
import MaBoSSNewParameterForm from "./MaBoSSNewParameterForm";


class MaBoSSParameters extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			parameters: null,

			showValueForm: false,
			parameterValueForm: "<node>",
			valueValueForm: "",
			errorValueForm: "",

			showNewParameterForm: false,

		};

		this.getParametersCall = null;
		this.saveParameterCall = null;
		this.checkDeleteParameterCall = null;
		this.deleteParameterCall = null;

		// this.editParameter = this.editParameter.bind(this);
		this.toggleValueForm = this.toggleValueForm.bind(this);
		this.deleteParameter = this.deleteParameter.bind(this);
		this.checkParameterValue = this.checkParameterValue.bind(this);
		this.saveParameter = this.saveParameter.bind(this);

		this.toggleNewParameterForm = this.toggleNewParameterForm.bind(this);
		this.showNewParameterForm = this.showNewParameterForm.bind(this);
	}

	createNewParameter(name, value) {
		const t_parameters = this.state.parameters;
		t_parameters[name] = value;

		this.saveParameterCall = APICalls.MaBoSSCalls.saveMaBoSSParameters(this.props.project, this.props.modelId, name, value)
		this.saveParameterCall.promise.then(() => {
			this.setState({
				parameters: t_parameters,
				showNewParameterForm: false,
			});
		});

	}

	toggleNewParameterForm() {
		this.setState({showNewParameterForm: !this.state.showNewParameterForm});
	}

	showNewParameterForm() {
		this.setState({showNewParameterForm: true});
	}

	loadParameters(project_id, model_id) {

		this.getParametersCall = APICalls.MaBoSSCalls.getMaBoSSParameters(project_id, model_id);
		this.getParametersCall.promise.then((data) => {
			this.setState({parameters: data});
		})
	}

	editParameter(name) {
		this.setState({
			showValueForm: true,
			parameterValueForm: name,
			valueValueForm: this.state.parameters[name],
		})
	}

	saveParameter(name, value) {
		const t_parameters = this.state.parameters;
		t_parameters[name] = value;

		this.saveParameterCall = APICalls.MaBoSSCalls.saveMaBoSSParameters(this.props.project, this.props.modelId, name, value)
		this.saveParameterCall.promise.then(() => {
			this.setState({
				parameters: t_parameters,
				showValueForm: false,
				parameterValueForm: null,
				valueValueForm: ""
			});
		});
	}

	deleteParameter(name) {
		this.props.showErrorMessages([]);

		this.checkDeleteParameterCall = APICalls.MaBoSSCalls.checkDeleteMaBoSSParameters(this.props.project, this.props.modelId, name);
		this.checkDeleteParameterCall.promise.then((data) => {
			if (data.error !== "") {
				this.props.showErrorMessages([data.error]);
			}
			else {
				this.deleteParameterCall = APICalls.MaBoSSCalls.deleteMaBoSSParameters(this.props.project, this.props.modelId, name);
				this.deleteParameterCall.promise.then((response) => {
					console.log(response);
					const t_parameters = this.state.parameters;
					delete t_parameters[name];
					this.setState({parameters: t_parameters});
				});

			}
		});

	}

	checkParameterValue(name, value) {
		if (value === "") {
			this.setState({errorValueForm: "Please provide a value"});
		} else if (isNaN(value)) {
			this.setState({errorValueForm: "Not a number"});
		} else {
			this.setState({errorValueForm: ""});
		}
	}

	toggleValueForm() {
		this.setState({
			showValueForm: !this.state.showValueForm
		})
	}

	componentDidMount() {
		this.loadParameters(this.props.project, this.props.modelId)
	}

	componentWillUnmount() {
		if (this.getParametersCall !== null) {
			this.getParametersCall.cancel();
		}
	}

	render() {

		return (
			<React.Fragment>
			<ul className="list-parameters">
				{
					this.state.parameters !== null ?
					Object.keys(this.state.parameters).map((name, index) => {
						return (
							<li key={index}>
								<table className="table-parameters">
									<thead>
									<tr className={"d-flex"}>
										<th className={"flex-fill name align-items-center"}>{name}</th>
										<th className={"value align-items-center justify-content-end"}>{this.state.parameters[name]}</th>
										<th className={"ml-1 actions d-flex align-items-center"}>
											<SimpleEditButton onClick={() => this.editParameter(name) } size={"sm"}/>
											<SimpleDeleteButton onClick={() => this.deleteParameter(name) } size={"sm"}/>
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
			<MaBoSSValueForm
				status={this.state.showValueForm} toggle={this.toggleValueForm}
				value={this.state.valueValueForm} error={this.state.errorValueForm}
				check={this.checkParameterValue} name={this.state.parameterValueForm}
				submit={this.saveParameter}
			/>
			<MaBoSSNewParameterForm
				status={this.state.showNewParameterForm}
				toggle={this.toggleNewParameterForm}
				parameters={this.state.parameters}
				submit={this.createNewParameter}
				{...this.props}
			/>
			<Button color="primary" onClick={this.showNewParameterForm}>New parameter</Button>

			</React.Fragment>
		);
	}
}

export default MaBoSSParameters;
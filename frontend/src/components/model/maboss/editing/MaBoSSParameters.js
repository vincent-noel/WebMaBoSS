import React from "react";
import {Button} from "reactstrap";

import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/LoadingIcon";

import "./table-parameters.scss";
import SimpleEditButton from "../../../commons/buttons/SimpleEditButton";
import SimpleDeleteButton from "../../../commons/buttons/SimpleDeleteButton";

import MaBoSSParameterForm from "./MaBoSSParameterForm";


class MaBoSSParameters extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			parameters: null,

			showValueForm: false,
			parameterValueForm: "",
			valueValueForm: "",

		};

		this.getParametersCall = null;
		this.saveParameterCall = null;
		this.checkDeleteParameterCall = null;
		this.deleteParameterCall = null;

		this.toggleValueForm = this.toggleValueForm.bind(this);
		this.saveParameter = this.saveParameter.bind(this);
		this.deleteParameter = this.deleteParameter.bind(this);
		this.createParameter = this.createParameter.bind(this);
	}

	createParameter() {
		this.setState({
			showValueForm: true,
			parameterValueForm: null,
			valueValueForm: ""
		});
	}

	editParameter(name) {
		this.setState({
			showValueForm: true,
			parameterValueForm: name,
			valueValueForm: this.state.parameters[name],
		})
	}

	saveParameter(name, value) {

		this.saveParameterCall = APICalls.MaBoSSCalls.saveMaBoSSParameter(this.props.project, this.props.modelId, name, value)
		this.saveParameterCall.promise.then((response) => {
			if (response.status == 200){
				const t_parameters = this.state.parameters;
				t_parameters[name] = value;

				this.setState({
					parameters: t_parameters,
					showValueForm: false,
					parameterValueForm: null,
					valueValueForm: ""
				});
			}
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
					if (response.status == 200){
						const t_parameters = this.state.parameters;
						delete t_parameters[name];
						this.setState({parameters: t_parameters});
					}
				});

			}
		});

	}

	toggleValueForm() {
		this.setState({
			showValueForm: !this.state.showValueForm
		})
	}

	loadParameters(project_id, model_id) {

		this.getParametersCall = APICalls.MaBoSSCalls.getMaBoSSParameters(project_id, model_id);
		this.getParametersCall.promise.then((data) => {
			this.setState({parameters: data});
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

			<MaBoSSParameterForm
				status={this.state.showValueForm} toggle={this.toggleValueForm}
				parameters={this.state.parameters} submit={this.saveParameter}
				name={this.state.parameterValueForm} value={this.state.valueValueForm}
				{...this.props}
			/>
			<Button color="primary" onClick={this.createParameter}>New parameter</Button>

			</React.Fragment>
		);
	}
}

export default MaBoSSParameters;
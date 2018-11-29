import React from "react";
import {Button, Collapse} from "reactstrap";


import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";

import {ProjectContext, ModelContext} from "../../../context";
import ErrorAlert from "../../../commons/ErrorAlert";
import NewForm from "./NewForm";


class Sensitivity extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

			newForm: {
				show: false,
			},

			errorMessages: []
		};

		this.showErrorMessages = this.showErrorMessages.bind(this);

		this.toggleNewForm = this.toggleNewForm.bind(this);
		this.startNew = this.startNew.bind(this);
	}

	toggleNewForm() {

		const new_form_props = this.state.newForm;
		new_form_props.show = !this.state.newForm.show;
		this.setState({newForm: new_form_props});
	}



	showErrorMessages(errorMessages) {
		this.setState({errorMessages: errorMessages});
	}


	createSensitivityAnalysis() {
		this.setState({
			newForm: {
				show: true
			}
		});
	}

	startNew() {

	}

	render() {

		return (
			<ModelPage
				path={this.props.match.path}
			>
				<ProjectContext.Consumer>
					{(projectContext => <ModelContext.Consumer>
						{(modelContext => <React.Fragment>
								<ModelName
									modelName={modelContext.modelName}
								/>

								<ErrorAlert errorMessages={this.state.errorMessages}/>

								<Button color="default" onClick={() => this.createSensitivityAnalysis()}>New sensitivity analysis</Button>
								<NewForm
									project={projectContext.project} modelId={modelContext.modelId}
									status={this.state.newForm.show} toggle={this.toggleNewForm}
									submit={this.startNew}
								/>
							</React.Fragment>
						)}
						</ModelContext.Consumer>
					)}
				</ProjectContext.Consumer>
			</ModelPage>
		);
	}
}

export default Sensitivity;
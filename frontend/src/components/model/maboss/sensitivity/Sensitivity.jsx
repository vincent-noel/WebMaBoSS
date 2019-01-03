import React from "react";
import {Button, Collapse} from "reactstrap";


import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";

import {ProjectContext, ModelContext} from "../../../context";
import ErrorAlert from "../../../commons/ErrorAlert";
import NewForm from "./NewForm";
import APICalls from "../../../api/apiCalls";
import OldForm from "./OldForm";
import SensitivityResult from "./SensitivityResult";


class Sensitivity extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

			newForm: {
				show: false,
			},

			oldForm: {
				show: false,
			},

			analysisId: null,

			errorMessages: []
		};

		this.showErrorMessages = this.showErrorMessages.bind(this);

		this.toggleNewForm = this.toggleNewForm.bind(this);
		this.toggleOldForm = this.toggleOldForm.bind(this);

		this.startNew = this.startNew.bind(this);
		this.loadExistingAnalysis = this.loadExistingAnalysis.bind(this);

		this.getAnalysesCall = null;
	}

	toggleOldForm() {
		this.setState(prevState => ({oldForm: {...prevState.oldForm, show: !this.state.oldForm.show}}))
	}

	toggleNewForm() {

		const new_form_props = this.state.newForm;
		new_form_props.show = !this.state.newForm.show;
		this.setState({newForm: new_form_props});
	}

	showSensitivityAnalysis() {
		this.setState(prevstate => ({oldForm: {...prevstate.oldForm, show: true}}));
	}


	showErrorMessages(errorMessages) {
		this.setState({errorMessages: errorMessages});
	}

	onAnalysisChange(analysis_id) {

	}

	createSensitivityAnalysis() {
		this.setState({
			newForm: {
				show: true
			}
		});
	}

	startNew(analysis_id) {
		this.setState(prevState => ({analysisId: analysis_id, newForm: {...prevState.newForm, show: false}}));
	}

	loadExistingAnalysis(analysis_id) {
		this.setState(prevState => ({analysisId: analysis_id, oldForm: {...prevState.oldForm, show: false}}));
	}

	componentDidMount() {
		// this.loadSensitivityAnalyses(this.props.project, this.props.modelId);
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
								<Button color="default" onClick={() => this.showSensitivityAnalysis()}>Existing sensitivity analysis</Button>
								<br/><br/>
								<NewForm
									project={projectContext.project} modelId={modelContext.modelId}
									status={this.state.newForm.show} toggle={this.toggleNewForm}
									submit={this.startNew}
								/>
								<OldForm
									project={projectContext.project} modelId={modelContext.modelId}
									status={this.state.oldForm.show} toggle={this.toggleOldForm}
									onSubmit={this.loadExistingAnalysis}
								/>

								<SensitivityResult
									project={projectContext.project}
									analysisId={this.state.analysisId}
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
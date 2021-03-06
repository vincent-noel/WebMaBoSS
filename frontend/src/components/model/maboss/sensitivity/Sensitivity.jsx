import React from "react";

import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";

import {ProjectContext, ModelContext} from "../../../context";
import ErrorAlert from "../../../commons/ErrorAlert";
import NewForm from "./NewForm";
import OldForm from "./OldForm";
import SensitivityResult from "./SensitivityResult";
import APICalls from "../../../api/apiCalls";
import SensitivityActions from "./SensitivityActions";


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

			listOfSensitivityAnalysis: {},

			errorMessages: []
		};

		this.showErrorMessages = this.showErrorMessages.bind(this);

		this.toggleNewForm = this.toggleNewForm.bind(this);
		this.toggleOldForm = this.toggleOldForm.bind(this);

		this.startNew = this.startNew.bind(this);

		this.createSensitivityAnalysis = this.createSensitivityAnalysis.bind(this);
		this.showSensitivityAnalysis = this.showSensitivityAnalysis.bind(this);
		this.loadExistingAnalysis = this.loadExistingAnalysis.bind(this);
		this.loadSensitivityAnalyses = this.loadSensitivityAnalyses.bind(this);

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

	loadSensitivityAnalyses (project_id, model_id) {
		this.setState({listOfSensitivityAnalysis: null});

		// if (this.getAnalysesCall !== null) { this.getAnalysesCall.cancel(); }
		this.getAnalysesCall = APICalls.MaBoSSCalls.getSensitivityAnalysis(project_id, model_id);
		this.getAnalysesCall.promise.then(response => {
			this.setState({listOfSensitivityAnalysis: response, selectedAnalysis: "Please select a simulation", selectedAnalysisId: null});
		})
	}

	createSensitivityAnalysis() {
		this.setState({
			newForm: {
				show: true
			}
		});
	}

	startNew(project_id, analysis_id) {
		this.setState(prevState => ({analysisId: analysis_id, newForm: {...prevState.newForm, show: false}}));
	}

	loadExistingAnalysis(project_id, analysis_id) {
		this.setState(prevState => ({analysisId: analysis_id, oldForm: {...prevState.oldForm, show: false}}));
	}

	componentWillUnmount() {
		if (this.getAnalysesCall !== null) { this.getAnalysesCall.cancel(); }
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

								<SensitivityActions
									project={projectContext.project} modelId={modelContext.modelId}
									createSensitivityAnalysis={this.createSensitivityAnalysis}
									loadSensitivityAnalyses={this.loadSensitivityAnalyses}
									listOfSensitivityAnalysis={this.state.listOfSensitivityAnalysis}
									showSensitivityAnalysis={this.showSensitivityAnalysis}

								/>
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
									loadSensitivityAnalyses={this.loadSensitivityAnalyses}
									listOfSensitivityAnalysis={this.state.listOfSensitivityAnalysis}
								/>

								<SensitivityResult
									project={projectContext.project}
									analysisId={this.state.analysisId}
									steadyStates={this.state.steadyStates}
									getSteadyStates={this.getFixedPoints}
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
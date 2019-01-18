import React from "react";
import {Button, Collapse} from "reactstrap";


import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";

import {ProjectContext, ModelContext} from "../../../context";
import ErrorAlert from "../../../commons/ErrorAlert";
import NewForm from "./NewForm";
import OldForm from "./OldForm";
import SensitivityResult from "./SensitivityResult";
import APICalls from "../../../api/apiCalls";


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
			analysisStatus: 0,

			steadyStates : {
				loaded: false,
				table: null
			},

			errorMessages: []
		};

		this.showErrorMessages = this.showErrorMessages.bind(this);

		this.toggleNewForm = this.toggleNewForm.bind(this);
		this.toggleOldForm = this.toggleOldForm.bind(this);

		this.startNew = this.startNew.bind(this);
		this.loadExistingAnalysis = this.loadExistingAnalysis.bind(this);
		this.getFixedPoints = this.getFixedPoints.bind(this);

		this.getAnalysesCall = null;
		this.getFixedPointsCall = null;

		this.getStatus = null;

		this.statusChecker = null;
	}

	getFixedPoints(project_id, analysis_id) {

		this.setState({steadyStates: {loaded: false, table: null}});
		this.getFixedPointsCall = APICalls.MaBoSSCalls.getSensitivityAnalysisSteadyStates(project_id, analysis_id);
		this.getFixedPointsCall.promise.then(data => {
			this.setState({steadyStates: {loaded: true, table: data.results}})

		});
	}

	checkAnalysisStatus(project_id, analysis_id) {
		this.getStatus = APICalls.MaBoSSCalls.getSensitivityAnalysisStatus(project_id, analysis_id);
		this.getStatus.promise.then(data => {
			this.setState({analysisStatus: data.done});
			if (data.done == 1) {
				this.stopCheckingStatus();
				this.getFixedPoints(project_id, analysis_id);
			}
		});
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

	startCheckingStatus(project_id, analysis_id) {
		this.statusChecker = setInterval(
			() => this.checkAnalysisStatus(project_id, analysis_id),
			1000
		);
	}

	stopCheckingStatus() {
		clearInterval(this.statusChecker);
	}

	startNew(project_id, analysis_id) {
		this.setState(prevState => ({analysisId: analysis_id, newForm: {...prevState.newForm, show: false}}));
		this.startCheckingStatus(project_id, analysis_id);
	}

	loadExistingAnalysis(project_id, analysis_id) {
		this.setState(prevState => ({analysisId: analysis_id, oldForm: {...prevState.oldForm, show: false}}));
		this.startCheckingStatus(project_id, analysis_id);
	}


	componentDidMount() {
		// this.loadSensitivityAnalyses(this.props.project, this.props.modelId);
    }

    componentWillUnmount() {
		clearInterval(this.statusChecker)
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
									analysisStatus={this.state.analysisStatus}
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
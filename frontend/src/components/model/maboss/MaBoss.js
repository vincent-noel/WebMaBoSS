import React from "react";
import ModelPage from "../ModelPage";
import ModelName from "../ModelName";

import MaBossResult from "./MaBossResult";
import MaBossActions from "./MaBossActions";

import {getAPIKey} from "../../commons/sessionVariables";
import {ProjectContext, ModelContext} from "../../context";


class MaBoss extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			simulationId: null,
			// listOfSimulations: []
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitOldSim = this.onSubmitOldSim.bind(this);
		// this.removeOldSim = this.removeOldSim.bind(this);
		// this.loadListSimulations = this.loadListSimulations.bind(this);
		// this.onModelChanged = this.onModelChanged.bind(this);
	}

	//
	// loadListSimulations(project_id, model_id) {
	// 	const conf = {
	// 	  method: "get",
	// 	  headers: new Headers({
	// 		'Authorization': "Token " + getAPIKey(),
	// 	  })
	// 	};
	//
	// 	fetch("/api/logical_model/" + project_id + "/" + model_id + "/maboss", conf)
	// 	.then(response => {	return response.json(); })
	// 	.then(data => { this.setState({listOfSimulations: data}); });
	// }
	//

	onSubmit(project_id, model_id, data) {
		this.setState({simulationId: null});
		const formData = new FormData();
		formData.append('sampleCount', data.sampleCount);
		formData.append('maxTime', data.maxTime);
		formData.append('timeTick', data.timeTick);
		formData.append('initialStates', JSON.stringify(data.initialStates));
		formData.append('internalVariables', JSON.stringify(data.internalVariables));

		const conf = {
		  method: "post",
		  body: formData,
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
		  })
		};

		fetch("/api/logical_model/" + project_id + "/" + model_id + "/maboss", conf)
		.then(response => response.json())
		.then(data => { this.setState({showNewSimForm: false, simulationId: data['simulation_id']})});

	}

	onSubmitOldSim(data) {
		this.setState({showOldSimForm: false, simulationId: data});
	}

	// removeOldSim(simulation_id) {
	//
	// 	const conf = {
	// 	  method: "delete",
	// 	  headers: new Headers({
	// 		'Authorization': "Token " + getAPIKey(),
	// 	  })
	// 	};
	//
	// 	fetch("/api/maboss/" + simulation_id + "/", conf)
	// 	.then(response => {	this.loadListSimulations(getProject(), getModel()); })
	//
	// }

	// onModelChanged() {
	// 	this.loadListSimulations(getProject(), getModel());
	// }
	//
	// componentDidMount() {
	// 	this.loadListSimulations(getProject(), getModel());
	// }

	render() {

		return (
			<ModelPage
				path={this.props.match.path}
				onModelChanged={this.onModelChanged}
			>
				<ProjectContext.Consumer>
					{(projectContext => <ModelContext.Consumer>
						{(modelContext => <React.Fragment>
								<ModelName
									modelName={modelContext.modelName}
								/>
								<MaBossActions
									project={projectContext.project}
									modelId={modelContext.modelId}
									onSubmit={this.onSubmit}
									onSubmitOldSim={this.onSubmitOldSim}
									// listOfSimulations={this.state.listOfSimulations}
									remove={this.removeOldSim}
								/>
								<MaBossResult simulationId={this.state.simulationId}/>
							</React.Fragment>
						)}
						</ModelContext.Consumer>
					)}
				</ProjectContext.Consumer>
			</ModelPage>
		);
	}
}

export default MaBoss;
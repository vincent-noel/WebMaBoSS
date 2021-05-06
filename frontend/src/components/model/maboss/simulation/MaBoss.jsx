import React from "react";
import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";

import MaBossResult from "./MaBossResult";
import MaBossActions from "./MaBossActions";

import {ProjectContext, ModelContext} from "../../../context";
import APICalls from "../../../api/apiCalls";


class MaBoss extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			simulationId: null,
			simulationName: "",

			listOfSimulations: null,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitOldSim = this.onSubmitOldSim.bind(this);
		this.updateSim = this.updateSim.bind(this);
		this.loadListSimulations = this.loadListSimulations.bind(this);
		this.removeOldSim = this.removeOldSim.bind(this);

		this.createMaBossSimulationCall = null;
		this.getListSimulationCall = null;
		this.removeSimulationCall = null;
	}

	removeOldSim(project_id, model_id, simulation_id) {

		this.removeSimulationCall = APICalls.MaBoSSCalls.deleteMaBossSimulation(project_id, simulation_id);
		this.removeSimulationCall.promise.then(response => this.loadListSimulations(project_id, model_id))
	}


	loadListSimulations(project_id, model_id) {

		if (this.getListSimulationCall !== null) {
			this.getListSimulationCall.cancel();
        }

		this.setState({
			listOfSimulations: null,
		});

		this.getListSimulationCall = APICalls.MaBoSSCalls.getListOfMaBoSSSimulations(project_id, model_id);
		this.getListSimulationCall.promise.then(data => {
			if (data.length > 0)
				this.setState({listOfSimulations: data});
		});
	}


	onSubmit(project_id, model_id, data) {
		this.setState({simulationId: null});
		this.createMaBossSimulationCall = APICalls.MaBoSSCalls.createMaBoSSSimulation(project_id, model_id, data);
		this.createMaBossSimulationCall.promise.then(api_data => {

			let listOfSimulations = this.state.listOfSimulations !== null ? this.state.listOfSimulations : [];
			listOfSimulations.push({id: api_data['simulation_id'], name: data.name});

			this.setState({
				showNewSimForm: false,
				simulationId: api_data['simulation_id'], simulationName: data.name,
				listOfSimulations: listOfSimulations
			});
		});

	}

	onSubmitOldSim(data, name) {
		this.setState({showOldSimForm: false, simulationId: data, simulationName: name});
	}

	updateSim(simulation_id) {
		this.setState({simulationId: simulation_id})
	}

	componentWillUnmount() {
		if (this.createMaBossSimulationCall !== null) this.createMaBossSimulationCall.cancel();
		if (this.getListSimulationCall !== null) this.getListSimulationCall.cancel();
		if (this.removeSimulationCall !== null) this.removeSimulationCall.cancel();
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
								<MaBossActions
									project={projectContext.project}
									modelId={modelContext.modelId}
									onSubmit={this.onSubmit}
									onSubmitOldSim={this.onSubmitOldSim}
									updateSim={this.updateSim}
									remove={this.removeOldSim}
									listOfSimulations={this.state.listOfSimulations}
									loadListSimulations={this.loadListSimulations}
									removeOldSim={this.removeOldSim}
								/>
								<MaBossResult
									project={projectContext.project}
									modelId={modelContext.modelId}
									simulationId={this.state.simulationId}
									simulationName={this.state.simulationName}
									getModels={modelContext.getModels}
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

export default MaBoss;
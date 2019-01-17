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
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitOldSim = this.onSubmitOldSim.bind(this);
		this.updateSim = this.updateSim.bind(this);

		this.createMaBossSimulationCall = null;
	}

	onSubmit(project_id, model_id, data) {
		this.setState({simulationId: null});
		this.createMaBossSimulationCall = APICalls.MaBoSSCalls.createMaBoSSSimulation(project_id, model_id, data);
		this.createMaBossSimulationCall.promise.then(api_data => {
			this.setState({showNewSimForm: false, simulationId: api_data['simulation_id'], simulationName: data.name})
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
								/>
								<MaBossResult
									project={projectContext.project}
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
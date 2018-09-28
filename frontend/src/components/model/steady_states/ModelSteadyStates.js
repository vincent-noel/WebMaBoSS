import React from "react";
import ModelPage from "../ModelPage";
import ModelName from "../ModelName";
import ModelSteadyStatesResult from "./ModelSteadyStatesResult";
import {ProjectContext, ModelContext} from "../../context";

class ModelSteadyStates extends React.Component {

	render() {
		return (
			<ModelPage path={this.props.match.path}>
				<ProjectContext.Consumer>
				{(projectContext => <ModelContext.Consumer>
					{(modelContext => <React.Fragment>
							<ModelName modelName={modelContext.modelName}/>
							<ModelSteadyStatesResult
								project={projectContext.project}
								modelId={modelContext.modelId}
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

export default ModelSteadyStates;
import React from "react";

import ModelPage from "../ModelPage";
import ModelName from "../ModelName";

import ModelGraph from "./ModelGraph";

import {NavLink} from "react-router-dom";

import {ProjectContext, ModelContext} from "../../context";

class Overview extends React.Component {

	render() {
		return <ModelPage path={this.props.match.path}>
			<ProjectContext.Consumer>
				{projectContext => (
				<ModelContext.Consumer>
					{modelContext => (
					<React.Fragment>
						<ModelName
							project={projectContext.project}
							modelId={modelContext.modelId}
							modelName={modelContext.modelName}
						/>
						<ModelGraph
							project={projectContext.project}
							modelId={modelContext.modelId}
						/>
					</React.Fragment>)}
				</ModelContext.Consumer>)}
			</ProjectContext.Consumer>
			<NavLink to="/model/overview_v2">v2</NavLink>
		</ModelPage>;
	}
}

export default Overview;
import React from "react";
import ModelPage from "../ModelPage";
import ModelName from "../ModelName";
import ModelGraphRaw from "../../commons/ModelGraphRaw";

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
						<ModelGraphRaw
							project={projectContext.project}
							modelId={modelContext.modelId}
						/>
					</React.Fragment>)}
				</ModelContext.Consumer>)}
			</ProjectContext.Consumer>
		</ModelPage>;
	}
}

export default Overview;
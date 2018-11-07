import React from "react";
import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";
import MaBoSSNodes from "./MaBoSSNodes";

import {ProjectContext, ModelContext} from "../../../context";


class Editing extends React.Component {

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
								<MaBoSSNodes
									project={projectContext.project}
									modelId={modelContext.modelId}
									onModelChanged={modelContext.onModelChanged}
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

export default Editing;
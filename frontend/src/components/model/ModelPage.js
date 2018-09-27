import React from "react";

import SideBar from "./SideBar";

import {getAPIKey, getModel, getProject} from "../commons/sessionVariables";
import MenuPage from "../MenuPage";
import {ProjectContext, ModelContext} from "../context";


class ModelPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			modelId: getModel(),
			modelName: undefined,
		};

		this.getName(getModel());
		this.onModelChanged = this.onModelChanged.bind(this);
	}

	getName(project_id, model_id) {
		fetch(
			"/api/logical_model/" + project_id + "/" + model_id + "/name",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {return response.json()})
		.then(data => {this.setState({modelName: data['name']})});
	}

	onModelChanged(project_id, model_id) {
		this.setState({modelId: model_id});
		this.getName(project_id, model_id);
	}

	render() {
		console.log("Rendering model page");
		return (
			<ModelContext.Provider value={{
				modelId: this.state.modelId,
				modelName: this.state.modelName,
				onModelChanged: this.onModelChanged
			}}>
				<MenuPage
					path={this.props.path}
					sidebar={<ProjectContext.Consumer>
							{(projectContext => <SideBar
								project={projectContext.project}
								modelId={this.state.modelId} modelName={this.state.modelName}
								onModelChanged={this.onModelChanged}
								path={this.props.path}
							/>)}
						</ProjectContext.Consumer>
					}
				>
					{this.props.children}
				</MenuPage>
			</ModelContext.Provider>
		);
	}
}

export default ModelPage;
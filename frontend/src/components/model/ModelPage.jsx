import React from "react";

import SideBar from "./SideBar";

import {getModel, setModel} from "../commons/sessionVariables";
import MenuPage from "../MenuPage";
import {ProjectContext, ModelContext} from "../context";
import APICalls from "../api/apiCalls";


class ModelPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			modelId: getModel(),
			modelName: null,
			models: [],
			loaded: false
		};
		this.onModelChanged = this.onModelChanged.bind(this);
		this.getModels = this.getModels.bind(this);

		this.getNameCall = null;
		this.getModelsCall = null;
	}

	getModels(project_id) {
		if (project_id !== undefined) {
			this.setState({models: [], loaded: false});
			this.getModelsCall = APICalls.ModelsCalls.getModels(project_id);
			this.getModelsCall.promise.then(models => {
				this.setState({ models: models, loaded: true });
			});
		}
	}


	getName(project_id, model_id) {
		if (project_id !== undefined && model_id !== undefined) {
			if (this.getNameCall !== null) this.getNameCall.cancel();
			this.setState({modelName: null});

			this.getNameCall = APICalls.ModelCalls.getName(project_id, model_id);
			this.getNameCall.promise.then(data => {
				this.setState({modelName: data['name']})
			});
		}
	}

	onModelChanged(project_id, model_id) {
		setModel(model_id);
		this.setState({modelId: model_id});
		this.getName(project_id, model_id);
	}


	componentWillUnmount() {
		if (this.getNameCall !== null) {
			this.getNameCall.cancel();
		}
	}

	render() {
		return (
			<ModelContext.Provider value={{
				modelId: this.state.modelId,
				modelName: this.state.modelName,
				onModelChanged: this.onModelChanged,
				models: this.state.models,
				loaded: this.state.loaded,
				getModels: this.getModels,
			}}>
				<MenuPage
					path={this.props.path}
					sidebar={<ProjectContext.Consumer>
							{(projectContext => <SideBar
								project={projectContext.project}
								modelId={this.state.modelId}
								modelName={this.state.modelName}
								onModelChanged={this.onModelChanged}
								path={this.props.path}
								models={this.state.models}
								loaded={this.state.loaded}
								getModels={this.getModels}
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
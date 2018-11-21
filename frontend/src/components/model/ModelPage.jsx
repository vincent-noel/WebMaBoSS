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
		};
		this.onModelChanged = this.onModelChanged.bind(this);
		this.getNameCall = null;
	}

	getName(project_id, model_id) {
		if (this.getNameCall !== null) this.getNameCall.cancel();
		this.setState({modelName: null});

		this.getNameCall = APICalls.ModelCalls.getName(project_id, model_id);
		this.getNameCall.promise.then(data => {this.setState({modelName: data['name']})});
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
				onModelChanged: this.onModelChanged
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
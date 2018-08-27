import React from "react";
import MenuPage from "../MenuPage";
import ModelName from "../ModelName";
import ModelSteadyStatesResult from "./ModelSteadyStatesResult";


class ModelSteadyStates extends React.Component {

	render() {
		return (
			<MenuPage modelId={this.props.match.params.modelId} path={this.props.match.path}>
				<ModelName modelId={this.props.match.params.modelId} />
				<ModelSteadyStatesResult modelId={this.props.match.params.modelId} />
			</MenuPage>
		);
	}
}

export default ModelSteadyStates;
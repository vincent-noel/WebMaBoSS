import React from "react";
import MenuPage from "../MenuPage";
import ModelName from "../ModelName";
import ModelSteadyStatesResult from "./ModelSteadyStatesResult";


class ModelSteadyStates extends React.Component {

	render() {
		return (
			<MenuPage modelId={sessionStorage.getItem('model')} path={this.props.match.path}>
				<ModelName modelId={sessionStorage.getItem('model')} />
				<ModelSteadyStatesResult modelId={sessionStorage.getItem('model')} />
			</MenuPage>
		);
	}
}

export default ModelSteadyStates;
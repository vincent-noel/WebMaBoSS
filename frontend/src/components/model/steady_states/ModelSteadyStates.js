import React from "react";
import MenuPage from "../MenuPage";
import ModelName from "../ModelName";
import ModelSteadyStatesResult from "./ModelSteadyStatesResult";
import {getModel} from "../../commons/sessionVariables";


class ModelSteadyStates extends React.Component {

	render() {
		return (
			<MenuPage path={this.props.match.path}>
				<ModelName />
				<ModelSteadyStatesResult />
			</MenuPage>
		);
	}
}

export default ModelSteadyStates;
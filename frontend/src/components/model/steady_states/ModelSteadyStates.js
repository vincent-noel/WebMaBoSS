import React from "react";
import ModelPage from "../ModelPage";
import ModelName from "../ModelName";
import ModelSteadyStatesResult from "./ModelSteadyStatesResult";


class ModelSteadyStates extends React.Component {

	render() {
		return (
			<ModelPage path={this.props.match.path}>
				<ModelName />
				<ModelSteadyStatesResult />
			</ModelPage>
		);
	}
}

export default ModelSteadyStates;
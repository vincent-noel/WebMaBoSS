import React from "react";

import MenuPage from "../MenuPage";
import ModelName from "../ModelName";

import ModelGraph from "./ModelGraph";
import {getModel} from "../../commons/sessionVariables";
// import ModelGraphRaw from "./ModelGraphRaw";
// import ModelGraphSBGN from "./ModelGraphSBGN";


class Overview extends React.Component {

	render() {
		return <MenuPage path={this.props.match.path}>
			<ModelName modelId={getModel()} />
			<ModelGraph modelId={getModel()} />
			{/*<ModelGraphRaw modelId={this.props.match.params.modelId} />*/}
			{/*<ModelGraphSBGN modelId={this.props.match.params.modelId} />*/}
		</MenuPage>;
	}
}

export default Overview;
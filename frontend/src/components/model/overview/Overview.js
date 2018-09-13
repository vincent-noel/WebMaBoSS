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
			<ModelName />
			<ModelGraph />
			{/*<ModelGraphRaw />*/}
			{/*<ModelGraphSBGN />*/}
		</MenuPage>;
	}
}

export default Overview;
import React from "react";

import ModelPage from "../ModelPage";
import ModelName from "../ModelName";

import ModelGraph from "./ModelGraph";
// import ModelGraphRaw from "./ModelGraphRaw";
// import ModelGraphSBGN from "./ModelGraphSBGN";


class Overview extends React.Component {

	render() {
		return <ModelPage path={this.props.match.path}>
			<ModelName />
			<ModelGraph />
			{/*<ModelGraphRaw />*/}
			{/*<ModelGraphSBGN />*/}
		</ModelPage>;
	}
}

export default Overview;
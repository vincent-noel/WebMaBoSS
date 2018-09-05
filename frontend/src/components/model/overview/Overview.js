import React from "react";

import MenuPage from "../MenuPage";
import ModelName from "../ModelName";

import ModelGraph from "./ModelGraph";
// import ModelGraphRaw from "./ModelGraphRaw";
// import ModelGraphSBGN from "./ModelGraphSBGN";


class Overview extends React.Component {

	render() {
		return <MenuPage modelId={sessionStorage.getItem('model')} path={this.props.match.path}>
			<ModelName modelId={sessionStorage.getItem('model')} />
			<ModelGraph modelId={sessionStorage.getItem('model')} />
			{/*<ModelGraphRaw modelId={this.props.match.params.modelId} />*/}
			{/*<ModelGraphSBGN modelId={this.props.match.params.modelId} />*/}
		</MenuPage>;
	}
}

export default Overview;
import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";
import Settings from "../../../Settings";

class MaBoSSLastStates extends React.Component {

	render() {
		if (this.props.fixedPoints !== null) {
			return <PieChart table={this.props.fixedPoints} colorList={Settings.colormap} title={this.props.simulationName}/>

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default MaBoSSLastStates;
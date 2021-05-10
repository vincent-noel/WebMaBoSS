import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";
import Settings from "../../../Settings";

class MaBoSSLastStates extends React.Component {

	render() {
		if (this.props.fixedPoints !== null) {
			if (Object.keys(this.props.fixedPoints).length > 0)
				return <PieChart table={this.props.fixedPoints} colorList={Settings.colormap}/>
			else 
				return <div/>;
				
		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default MaBoSSLastStates;
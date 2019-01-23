import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";

class MaBossFixedPoints extends React.Component {

	render() {

		if (this.props.fixedPoints !== null) {
			return <PieChart table={this.props.fixedPoints} colorList={this.props.colormap} title={this.props.simulationName}/>

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default MaBossFixedPoints;
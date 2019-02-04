import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import LineChart from "../../../charts/LineChart";
import Settings from "../../../Settings";


class MaBossStatesProbTraj extends React.Component {

	render() {

		if (this.props.statesProbas !== null) {
			return <LineChart
				traj={this.props.statesProbas} colorList={Settings.colormap} title={this.props.simulationName}
			/>;

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>;

		} else {
			return <div/>
		}

	}
}

export default MaBossStatesProbTraj;
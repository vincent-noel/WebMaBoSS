import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";
import Settings from "../../../Settings";
import MaBoSSFixedPointResult from "./MaBoSSFixedPointResult";
import ModelGraphRaw from "../../../commons/ModelGraphRaw";
class MaBossFixedPoints extends React.Component {

	render() {
		if (this.props.fixedPoints !== null) {
			let data = this.props.fixedPoints.reduce((result, item) => {
				result.push(item.nodes);
				return result;
			}, []);
			return <React.Fragment>
				<MaBoSSFixedPointResult
					project={this.props.project}
					modelId={this.props.modelId}
					data={data}
				/>
				
			</React.Fragment>;

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default MaBossFixedPoints;
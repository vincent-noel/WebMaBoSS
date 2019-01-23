import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";
import {Bubble} from "react-chartjs-2";
import PCAChart from "../../../charts/PCAChart";
// import 'chartjs-plugin-annotation';

class MaBossSteadyStatesPCA extends React.Component {

	render() {

		if (this.props.data) {
			return <PCAChart
				data={this.props.data} arrows={this.props.arrows} colormap={this.props.colormap}
				arrowLabels={this.props.arrowLabels} title={this.props.simulationName}
				xLabel={"PC1 (" + this.props.explainedVariance[0] + "%)"}
				yLabel={"PC2 (" + this.props.explainedVariance[1] + "%)"}
			/>

		} else if (this.props.simulationId !== null) {
			return <LoadingIcon width="3rem"/>

		} else {
			return <div/>

		}
	}
}

export default MaBossSteadyStatesPCA;
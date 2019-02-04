import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";
import {Bubble} from "react-chartjs-2";
import PCAChart from "../../../charts/PCAChart";
import Settings from "../../../Settings";
// import 'chartjs-plugin-annotation';

class MaBossPCA extends React.Component {

	// static defaultState = {
	// 	loaded: false,
	// 	data: null,
	// 	arrows: null,
	// 	arrowLabels: null,
	// }
	//
	// constructor(props) {
	// 	super(props);
	//
	// 	this.state = MaBossPCA.defaultState;
	//
	// 	this.pcaChecker = null;
	// 	this.getPCACall = null;
	// }
	//
	// getPCA(project_id, simulation_id) {
	//
	// 	this.setState({fptableLoaded: false, fptable: null});
	// 	this.getPCACall = APICalls.MaBoSSCalls.getPCA(project_id, simulation_id);
	// 	this.getPCACall.promise.then(data => {
	// 		if (data.status === "Finished") {
	// 			clearInterval(this.pcaChecker);
	// 			this.setState({loaded: true, data: JSON.parse(data.data), arrows: data.arrows, arrowLabels: data.arrowlabels})
	// 		}
	// 	});
	// }
	//
	// componentDidMount() {
	// 	this.pcaChecker = setInterval(() => this.getPCA(this.props.project, this.props.simulationId), 1000);
	// }
	//
	// shouldComponentUpdate(nextProps, nextState) {
	//
	// 	if (this.props.modelId !== nextProps.modelId) {
	// 		this.setState(MaBossPCA.defaultState);
	// 		return false;
	// 	}
	//
	// 	if (this.props.simulationId !== nextProps.simulationId && nextProps.simulationId !== null) {
	// 		if (this.getPCACall !== null) { this.getPCACall.cancel(); }
	// 		clearInterval(this.pcaChecker);
	// 		this.setState(MaBossPCA.defaultState);
	// 		this.pcaChecker = setInterval(() => this.getPCA(nextProps.project, nextProps.simulationId), 1000);
	// 		return false;
	// 	}
	// 	return true;
	//
	// }
	//
	// componentWillUnmount() {
	// 	if (this.getPCACall !== null) { this.getPCACall.cancel(); }
	// 	clearInterval(this.pcaChecker);
	// }

	render() {

		if (this.props.data) {
			return <PCAChart
				data={this.props.data} arrows={this.props.arrows} colormap={Settings.colormap}
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

export default MaBossPCA;
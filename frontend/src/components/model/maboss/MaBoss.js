import React from "react";
import MenuPage from "../MenuPage";
import ModelName from "../ModelName";

import MaBossResult from "./MaBossResult";
import MaBossActions from "./MaBossActions";

import {getAPIKey, getModel, getProject} from "../../commons/sessionVariables";


class MaBoss extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			simulationId: null,
			listOfSimulations: []
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitOldSim = this.onSubmitOldSim.bind(this);
		this.removeOldSim = this.removeOldSim.bind(this);
		this.loadListSimulations = this.loadListSimulations.bind(this);
	}


	loadListSimulations() {
		const conf = {
		  method: "get",
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
		  })
		};

		fetch("/api/logical_model/" + getProject() + "/" + getModel() + "/maboss", conf)
		.then(response => {	return response.json(); })
		.then(data => { this.setState({listOfSimulations: data}); });

	}


	onSubmit(data) {
		this.setState({simulationId: null});
		const formData = new FormData();
		formData.append('sampleCount', data.sampleCount);
		formData.append('maxTime', data.maxTime);
		formData.append('timeTick', data.timeTick);

		const conf = {
		  method: "post",
		  body: formData,
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
		  })
		};

		fetch("/api/logical_model/" + getProject() + "/" + getModel() + "/maboss", conf)
		.then(response => {	return response.json(); })
		.then(data => { this.setState({showNewSimForm: false, simulationId: data['simulation_id']})});

	}

	onSubmitOldSim(data) {
		this.setState({showOldSimForm: false, simulationId: data});
	}

	removeOldSim(simulation_id) {


		const conf = {
		  method: "delete",
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
		  })
		};

		fetch("/api/maboss/" + simulation_id + "/", conf)
		.then(response => {	this.loadListSimulations() })

	}

	componentDidMount() {
		this.loadListSimulations();
	}

	render() {

		return (
			<MenuPage path={this.props.match.path} onModelChanged={this.loadListSimulations}>
				<ModelName />
				<MaBossActions
					onSubmit={this.onSubmit}
					onSubmitOldSim={this.onSubmitOldSim}
					listOfSimulations={this.state.listOfSimulations}
					remove={this.removeOldSim}
				/>
				<MaBossResult simulationId={this.state.simulationId}/>
			</MenuPage>
		);
	}
}

export default MaBoss;
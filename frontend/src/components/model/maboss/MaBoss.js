import React from "react";
import MenuPage from "../MenuPage";
import ModelName from "../ModelName";

import MaBossForm from "./MaBossForm";
import MaBossResult from "./MaBossResult";
import NewSimForm from "./NewSimForm";
import OldSimForm from "./OldSimForm";
import getCSRFToken from "../../commons/getCSRFToken";
import {getAPIKey, getModel, getProject} from "../../commons/sessionVariables";
import {Button, ButtonToolbar} from "reactstrap";


class MaBoss extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			simulationId: undefined,
			fptable: undefined,

			showNewSimForm: false,
			showOldSimForm: false,

			listOfSimulations: []
		};

		this.toggleNewSimForm = this.toggleNewSimForm.bind(this);
		this.toggleOldSimForm = this.toggleOldSimForm.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitOldSim = this.onSubmitOldSim.bind(this);
		this.loadListSimulations = this.loadListSimulations.bind(this);
	}


	loadListSimulations() {
		const conf = {
		  method: "get",
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
			'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/logical_model/" + getProject() + "/" + getModel() + "/maboss", conf)
		.then(response => {	return response.json(); })
		.then(data => { this.setState({listOfSimulations: data}); });

	}


	onSubmit(data) {
		const formData = new FormData();
		formData.append('sampleCount', data.sampleCount);
		formData.append('maxTime', data.maxTime);
		formData.append('timeTick', data.timeTick);

		const conf = {
		  method: "post",
		  body: formData,
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
			'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/logical_model/" + getProject() + "/" + getModel() + "/maboss", conf)
		.then(response => {	return response.json(); })
		.then(data => { this.setState({showNewSimForm: false, simulationId: data['simulation_id']})});

	}

	onSubmitOldSim(data) {
		this.setState({showOldSimForm: false, simulationId: data});
	}

	toggleNewSimForm() {
		this.setState((state) => ({
			showNewSimForm: !state.showNewSimForm
		}))
	}

	toggleOldSimForm() {
		this.setState((state) => ({
			showOldSimForm: !state.showOldSimForm
		}))
	}

	componentDidMount() {
		this.loadListSimulations();
	}

	render() {

		return (
			<MenuPage path={this.props.match.path} onModelChanged={this.loadListSimulations}>
				<ModelName modelId={getModel()}/>

				<ButtonToolbar className="justify-content-start">
					<Button className="mr-1" onClick={() => {this.toggleNewSimForm();}}>New simulation</Button>
					{
						this.state.listOfSimulations.length > 0
						? 	<Button className="mr-1" onClick={() => {this.toggleOldSimForm();}}>
								Load old simulation
							</Button>
						: null
					}
				</ButtonToolbar>
				<br/><br/>
				{/*<MaBossForm modelId={getModel()} onSubmit={(e, data) => this.onSubmit(e, data)}/>*/}
				<MaBossResult modelId={getModel()} simulationId={this.state.simulationId}/>
				<NewSimForm
					modelId={getModel()}
					onSubmit={this.onSubmit}
					status={this.state.showNewSimForm}
					toggle={this.toggleNewSimForm}
				/>
				<OldSimForm
					modelId={getModel()}
					onSubmit={this.onSubmitOldSim}
					status={this.state.showOldSimForm}
					toggle={this.toggleOldSimForm}
					listOfSimulations={this.state.listOfSimulations}
				/>
			</MenuPage>
		);
	}
}

export default MaBoss;
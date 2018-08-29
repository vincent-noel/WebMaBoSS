import React from "react";
import MenuPage from "../MenuPage";
import ModelName from "../ModelName";

import MaBossForm from "./MaBossForm";
import MaBossResult from "./MaBossResult";

import getCSRFToken from "../../commons/getCSRFToken";


class MaBoss extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			simulationId: undefined,
			fptable: undefined
		};

		this.onSubmit.bind(this);
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
			'Authorization': "Token " + sessionStorage.getItem("api_key"),
			'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/logical_model/" + this.props.match.params.modelId + "/maboss/", conf)
		.then(response => {	return response.json(); })
		.then(data => { this.setState({simulationId: data['simulation_id']})});
	}

	render() {

		return (
			<MenuPage modelId={this.props.match.params.modelId} path={this.props.match.path}>
				<ModelName modelId={this.props.match.params.modelId}/>
				<MaBossForm modelId={this.props.match.params.modelId} onSubmit={(e, data) => this.onSubmit(e, data)}/>
				<MaBossResult modelId={this.props.match.params.modelId} simulationId={this.state.simulationId}/>
			</MenuPage>
		);
	}
}

export default MaBoss;
import {getAPIKey, getProject} from "./sessionVariables";
import makeCancelable from "./makeCancelable";
import {saveAs} from "file-saver";

class APICalls {

	static getProjects() {
		return makeCancelable(
			fetch(
				"/api/projects/", {
					method: "get",
					headers: new Headers({'Authorization': "Token " + getAPIKey()})
				}
			).then(response => response.json())
		);
	}

	static getModels(project_id) {
		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/", {
					method: "get",
					headers: new Headers({'Authorization': "Token " + getAPIKey()})
				}
			).then(response => response.json())
		);
	}

	static createProject(name, description) {

		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);

		return makeCancelable(
			fetch(
				"/api/projects/",
				{
					method: "post",
					body: formData,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			)
		);
	}

	static updateProject(name, description, id) {

		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);

		return makeCancelable(
			fetch(
				"/api/projects/" + id,
				{
					method: "put",
					body: formData,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			)
		);
	}

	static importModel(project_id, file, name) {

		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);

		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/",
				{
					method: "post",
					body: formData,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			)
		);

	}

	static getName(project_id, model_id) {
		return makeCancelable(
			fetch(
			"/api/logical_model/" + project_id + "/" + model_id + "/name",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		).then(response => {return response.json()}));
	}

	static downloadModelAsZGINML(project_id, model_id) {
		fetch("/api/logical_models/" + project_id + "/" + model_id + "/file", {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()}),
		})
		.then(response => response.blob())
		.then(blob => saveAs(blob, this.props.filename));

	}

	static getGraph(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/graph",
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey()
					})
				}
			).then(response => response.blob()
			).then(
				blob => new Promise((resolve, reject) => {
					const reader = new FileReader;
					reader.onerror = reject;
					reader.onload = () => {
						resolve(reader.result);
					};
					reader.readAsDataURL(blob);
				})
			)
		);

	}

	static getSteadyStates(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/steady_states", {
					method: "get",
					headers: new Headers({'Authorization': "Token " + getAPIKey()})
				}
			).then(response => {
				if (response.status == 200) {
					return response.json();
				} else {
					return {};
				}
			})
		);
	}

	static getSteadyStatesGraph(project_id, model_id, steady_state) {

		const body = new FormData();
		body.append('steady_state', JSON.stringify(steady_state));

		return makeCancelable(
			fetch(
				"/api/logical_model/" + this.props.project + "/" + this.props.modelId + "/graph",
				{
					method: "post",
					body: body,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey()
					})
				}
			).then(response => response.blob()
			).then(
				blob => new Promise((resolve, reject) => {
					const reader = new FileReader;
					reader.onerror = reject;
					reader.onload = () => {
						resolve(reader.result);
					};
					reader.readAsDataURL(blob);
				})
			)
		);
	}

	static createMaBoSSSimulation(project_id, model_id, data) {

		const formData = new FormData();
		formData.append('sampleCount', data.sampleCount);
		formData.append('maxTime', data.maxTime);
		formData.append('timeTick', data.timeTick);
		formData.append('initialStates', JSON.stringify(data.initialStates));
		formData.append('internalVariables', JSON.stringify(data.internalVariables));

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/maboss",
				{
					method: "post",
					body: formData,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => response.json())
		);
	}

	static getMaBoSSSimulationSettings(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/maboss/settings/",
				{
				  method: "get",
				  headers: new Headers({
					'Authorization': "Token " + getAPIKey(),
				  })
				}
			).then(response => response.json())
		);
	}

	static getListOfMaBoSSSimulations(project_id, model_id) {

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/maboss",
				{
				  method: "get",
				  headers: new Headers({
					'Authorization': "Token " + getAPIKey(),
				  })
				}
			).then(response => response.json())
		);
	}

	static deleteMaBossSimulation(simulation_id) {
		return makeCancelable(
			fetch(
				"/api/maboss/" + simulation_id + "/",
				{
				  method: "delete",
				  headers: new Headers({
					'Authorization': "Token " + getAPIKey(),
				  })
				}
			)
		);
	}

	static getFixedPoints(simulation_id) {
		return makeCancelable(
			fetch(
				"/api/maboss/" + simulation_id + "/fixed_points/",
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => response.json())
		);
	}

	static getNodesProbTraj(simulation_id) {
		return makeCancelable(
			fetch(
				"/api/maboss/" + simulation_id + "/nodes_trajs/",
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => response.json())
		);
	}

	static getStatesProbTraj(simulation_id) {
		return makeCancelable(
			fetch(
				"/api/maboss/" + simulation_id + "/states_trajs/",
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => response.json())
		);
	}
}
export default APICalls;
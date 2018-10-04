import {getAPIKey, clearAPIKey} from "./sessionVariables";
import makeCancelable from "./makeCancelable";
import FileSaver from "file-saver";


function checkAuthorization(response) {
	if (response.status === 401) {
		clearAPIKey();
	}

	return response;
}

function extractFilename(content_disposition) {
	let filename = content_disposition.substr(content_disposition.lastIndexOf("filename"), content_disposition.length);
	if (filename.indexOf(";") >= 0) filename = filename.substr(0, filename.indexOf(";"));
	return filename.split("=")[1].replace(/"/g, '');
}

class APICalls {

	static getProjects() {
		return makeCancelable(
			fetch(
				"/api/projects/", {
					method: "get",
					headers: new Headers({'Authorization': "Token " + getAPIKey()})
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

	static getModels(project_id) {
		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/", {
					method: "get",
					headers: new Headers({'Authorization': "Token " + getAPIKey()})
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
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
			).then(response => checkAuthorization(response))
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
			).then(response => checkAuthorization(response))
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
			).then(response => checkAuthorization(response))
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
		).then(response => checkAuthorization(response))
		.then(response => {return response.json()}));
	}

	static downloadModelAsZGINML(project_id, model_id, tag) {

		let endpoint = null;
		if (tag === undefined)
			endpoint = "/api/logical_models/" + project_id + "/" + model_id + "/file";
		else
			endpoint = "/api/logical_models/" + project_id + "/" + model_id + "/tags/" + tag + "/file";

		fetch(endpoint, {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()}),
		}).then(response => checkAuthorization(response))
		.then(response => Promise.all([
			extractFilename(response.headers.get('content-disposition')),
			response.blob()])
		)
		.then(([filename, blob]) => FileSaver.saveAs(blob, filename));
	}

	static downloadModelAsSBML(project_id, model_id, tag) {

		let endpoint = null;
		if (tag === undefined)
			endpoint = "/api/logical_models/" + project_id + "/" + model_id + "/sbmlfile";
		else
			endpoint = "/api/logical_models/" + project_id + "/" + model_id + "/tags/" + tag + "/sbmlfile";

		fetch(endpoint, {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()}),
		}).then(response => checkAuthorization(response))
		.then(response => Promise.all([
			extractFilename(response.headers.get('content-disposition')),
			response.blob()])
		)
		.then(([filename, blob]) => FileSaver.saveAs(blob, filename));

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
			).then(response => checkAuthorization(response))
			.then(response => response.blob())
			.then(
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
			).then(response => checkAuthorization(response))
			.then(response => {
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
			).then(response => checkAuthorization(response))
			.then(response => response.blob()
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
		formData.append('outputVariables', JSON.stringify(data.outputVariables));
		formData.append('mutations', JSON.stringify(data.mutations));

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
			).then(response => checkAuthorization(response))
			.then(response => response.json())
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
			).then(response => checkAuthorization(response))
			.then(response => response.json())
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
			).then(response => checkAuthorization(response))
			.then(response => response.json())
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
			).then(response => checkAuthorization(response))
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
			).then(response => checkAuthorization(response))
			.then(response => response.json())
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
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

	static deleteById(endpoint, id) {
		console.log(endpoint + id);
		return makeCancelable(
			fetch(endpoint + id, {
				method: "delete",
				headers: new Headers({'Authorization': "Token " + getAPIKey()})
			}).then(response => checkAuthorization(response))
		);
	}

	static editById(endpoint, id) {
		return makeCancelable(
			fetch(endpoint + id, {
				method: "get",
				headers: new Headers({'Authorization': "Token " + getAPIKey()})
			}).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

	static getMaBoSSServers() {
		return makeCancelable(
			fetch(
				"/api/maboss/servers/",
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

	static createMaBoSSServer(host, port) {

		const formData = new FormData();
		formData.append('host', host);
		formData.append('port', port);

		return makeCancelable(
			fetch(
				"/api/maboss/servers/",
				{
					method: "post",
					body: formData,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => checkAuthorization(response))
		);
	}

	static updateMaBoSSServer(host, port, id) {
		const formData = new FormData();
		formData.append('host', host);
		formData.append('port', port);

		return makeCancelable(
			fetch(
				"/api/maboss/servers/" + id,
				{
					method: "put",
					body: formData,
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => checkAuthorization(response))
		);
	}

	static deleteMaBoSSServer(id) {
		return makeCancelable(
			fetch(
				"/api/maboss/servers/" + id,
				{
					method: "delete",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => checkAuthorization(response))
		);
	}

	static listModelTags(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/" + model_id + "/tags/",
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					})
				}
			).then(response => checkAuthorization(response)
			).then(response => response.json())
		)
	}

	static createModelTag(project_id, model_id, tag) {
		const formData = new FormData();
		formData.append('tag', tag);

		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/" + model_id + "/tags/",
				{
					method: "post",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					}),
					body: formData
				}
			).then(response => checkAuthorization(response))
		)
	}

	static deleteModelTag(project_id, model_id, tag) {
		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/" + model_id + "/tags/" + tag,
				{
					method: "delete",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					}),
				}
			).then(response => checkAuthorization(response))
		)
	}

	static loadModelTag(project_id, model_id, tag) {
		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/" + model_id + "/tags/" + tag,
				{
					method: "get",
					headers: new Headers({
						'Authorization': "Token " + getAPIKey(),
					}),
				}
			).then(response => checkAuthorization(response))
		)
	}

}
export default APICalls;
import {getAPIKey} from "./sessionVariables";

function getProjects(callback) {
	fetch(
		"/api/projects/", {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()})
		}
	)
	.then(response => response.json())
	.then(data => { callback(data); });
}

function getModelsFromAPI(project_id, callback) {
	fetch(
		"/api/logical_models/" + project_id + "/", {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()})
		}
	)
	.then(response => response.json())
	.then(data => { callback(data); });
}

export {getProjects, getModelsFromAPI};
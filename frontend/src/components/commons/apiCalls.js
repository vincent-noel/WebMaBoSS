import {getAPIKey} from "./sessionVariables";
import makeCancelable from "./makeCancelable";

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

function getModelsFromAPI(project_id) {
	return fetch(
		"/api/logical_models/" + project_id + "/", {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()})
		}
	).then(response => response.json());
}

class APICalls {

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
			)
				.then(response => {
					return response.blob();
				})
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
}
export {getProjects, getModelsFromAPI, APICalls};
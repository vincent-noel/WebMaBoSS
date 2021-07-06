import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";


class ModelCalls {

	static getName(project_id, model_id) {
		return makeCancelable(
			fetch(
			"/api/logical_model/" + project_id + "/" + model_id + "/name",
			{
				method: "get",
				headers: getDefaultHeaders()
			}
		).then(response => checkAuthorization(response))
		.then(response => {return response.json()}));
	}
	
	static setName(project_id, model_id, name) {
		
		const body = new FormData();
		body.append('name', name);
	
		return makeCancelable(
			fetch(
			"/api/logical_model/" + project_id + "/" + model_id + "/name",
			{
				method: "post",
				body: body,
				headers: getDefaultHeaders()
			}
		).then(response => checkAuthorization(response))
		.then(response => {return response.json()}));
	}
	
	static getGraph(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/graph",
				{
					method: "get",
					headers: getDefaultHeaders()
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

	static getGraphRaw(project_id, model_id) {

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/graph_raw",
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}
	static setGraphPositions(project_id, model_id, positions) {
		
		const body = new FormData();
		body.append('positions', JSON.stringify(positions));

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/graph_raw",
				{
					method: "post",
					body: body,
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}
	
	static updateGraphPosition(project_id, model_id, node, position) {
		
		const body = new FormData();
		body.append('position', JSON.stringify(position));

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/graph_raw/" + node,
				{
					method: "post",
					body: body,
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

	static getNodes(project_id, model_id) {

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/nodes",
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

	static getSteadyStates(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/steady_states", {
					method: "get",
					headers: getDefaultHeaders()
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
				"/api/logical_model/" + project_id + "/" + model_id + "/graph",
				{
					method: "post",
					body: body,
					headers: getDefaultHeaders()
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

}
export default ModelCalls;
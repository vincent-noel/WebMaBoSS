import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";

class MaBoSSCalls {


	static getMaBoSSNodes(project_id, model_id) {

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

	static getMaBoSSNodesFormulas(project_id, model_id, node_id) {
		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/" + node_id + "/formulas",
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
			.then(response => JSON.parse(response))
		);
	}

	static checkFormula(project_id, model_id, formula) {

		const body = new FormData();
		body.append('formula', formula);

		return makeCancelable(
			fetch(
				"/api/logical_model/" + project_id + "/" + model_id + "/check_formula",
				{
					method: "post",
					body: body,
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
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
					headers: getDefaultHeaders()
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
				  headers: getDefaultHeaders()
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
				  headers: getDefaultHeaders()
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
				  headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

}
export default MaBoSSCalls;
import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";

class ModelTagsCalls {

	static listModelTags(project_id, model_id) {
		return makeCancelable(
			fetch(
				"/api/logical_models/" + project_id + "/" + model_id + "/tags/",
				{
					method: "get",
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders(),
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
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
		)
	}

}
export default ModelTagsCalls;
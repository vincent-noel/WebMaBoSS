import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";


class ProjectCalls {

	static getProjects() {
		return makeCancelable(
			fetch(
				"/api/projects/", {
					method: "get",
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
		);
	}
}
export default ProjectCalls;
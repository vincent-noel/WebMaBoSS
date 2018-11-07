import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";

class MaBoSSServerCalls {


	static getMaBoSSServers() {
		return makeCancelable(
			fetch(
				"/api/maboss/servers/",
				{
					method: "get",
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response))
		);
	}


}
export default MaBoSSServerCalls;
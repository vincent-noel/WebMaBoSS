import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";

function extractFilename(content_disposition) {
	let filename = content_disposition.substr(content_disposition.lastIndexOf("filename"), content_disposition.length);
	if (filename.indexOf(";") >= 0) filename = filename.substr(0, filename.indexOf(";"));
	return filename.split("=")[1].replace(/"/g, '');
}

class GenericCalls {

	static deleteById(endpoint, id) {
		return makeCancelable(
			fetch(endpoint + id, {
				method: "delete",
				headers: getDefaultHeaders()
			}).then(response => checkAuthorization(response))
		);
	}

	static editById(endpoint, id) {
		return makeCancelable(
			fetch(endpoint + id, {
				method: "get",
				headers: getDefaultHeaders()
			}).then(response => checkAuthorization(response))
			.then(response => response.json())
		);
	}

}
export default GenericCalls;
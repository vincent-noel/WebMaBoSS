import {getAPIKey, clearAPIKey} from "../commons/sessionVariables";

function checkAuthorization(response) {
	if (response.status === 401) {
		clearAPIKey();
	}

	return response;
}


const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

function getDefaultHeaders() {
	return new Headers({'Authorization': "Token " + getAPIKey()})
}

function extractFilename(content_disposition) {
	let filename = content_disposition.substr(content_disposition.lastIndexOf("filename"), content_disposition.length);
	if (filename.indexOf(";") >= 0) filename = filename.substr(0, filename.indexOf(";"));
	return filename.split("=")[1].replace(/"/g, '');
}

export {checkAuthorization, makeCancelable, getDefaultHeaders, extractFilename};
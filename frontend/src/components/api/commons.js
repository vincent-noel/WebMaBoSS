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

export {checkAuthorization, makeCancelable, getDefaultHeaders};
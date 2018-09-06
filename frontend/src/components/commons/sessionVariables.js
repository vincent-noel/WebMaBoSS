function getProject() {
    return sessionStorage.getItem("project");
}

function setProject(project) {
    return sessionStorage.setItem("project", project);
}

function getModel() {
    return sessionStorage.getItem("model");
}

function setModel(project) {
    return sessionStorage.setItem("model", project);
}

function setAPIKey(api_key) {
    sessionStorage.setItem("api_key", api_key);
}

function getAPIKey() {
    return sessionStorage.getItem("api_key");
}

function isConnected() {
    return (sessionStorage.getItem("api_key") !== null);
}

function clearAPIKey() {
    sessionStorage.removeItem("api_key");
}
export {getProject, setProject, getModel, setModel, setAPIKey, getAPIKey, isConnected, clearAPIKey};
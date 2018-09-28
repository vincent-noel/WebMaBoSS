function getProject() {
    return parseInt(sessionStorage.getItem("project"));
}

function setProject(project) {
    return sessionStorage.setItem("project", project);
}

function getModel() {
    return parseInt(sessionStorage.getItem("model"));
}

function setModel(model) {
    return sessionStorage.setItem("model", model);
}

function clearModel() {
    sessionStorage.removeItem("model");
}

function setAPIKey(api_key) {
    sessionStorage.setItem("api_key", api_key);
}

function getAPIKey() {
    return sessionStorage.getItem("api_key");
}

function setUser(username) {
    sessionStorage.setItem("user", JSON.stringify({'username': username}));
}

function getUsername() {
    return JSON.parse(sessionStorage.getItem("user"))['username']
}

function clearUser() {
    sessionStorage.removeItem("user");
}

function isConnected() {
    return (sessionStorage.getItem("api_key") !== null);
}

function clearAPIKey() {
    sessionStorage.removeItem("api_key");
}
export {
    getProject, setProject,
    getModel, setModel, clearModel,
    setAPIKey, getAPIKey, clearAPIKey,
    setUser, getUsername, clearUser,
    isConnected,
};
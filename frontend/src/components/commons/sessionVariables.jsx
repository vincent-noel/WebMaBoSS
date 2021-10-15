function getProject() {
    
    if (sessionStorage.getItem("project") !== null) {
        return parseInt(sessionStorage.getItem("project"));
    } else return 0;
}

function setProject(project) {
    return sessionStorage.setItem("project", project);
}

function clearProject() {
    sessionStorage.removeItem("project");
}

function getModel() {
    if (sessionStorage.getItem("model")) {
        return parseInt(sessionStorage.getItem("model"));
    }
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
    getProject, setProject, clearProject,
    getModel, setModel, clearModel,
    setAPIKey, getAPIKey, clearAPIKey,
    setUser, getUsername, clearUser,
    isConnected,
};
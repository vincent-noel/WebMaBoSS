function isConnected() {
    return (sessionStorage.getItem("api_key") !== null);
}

export default isConnected;
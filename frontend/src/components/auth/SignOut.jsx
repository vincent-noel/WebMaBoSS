import React from "react";
import history from '../history';
import {clearAPIKey, clearModel, clearUser, clearProject} from "../commons/sessionVariables";
import APICalls from "../api/apiCalls";


class SignOut extends React.Component {

	constructor(props) {
		super(props);
		this.logoutCall = null
	}

	componentWillUnmount() {
		if (this.logoutCall !== null) this.logoutCall.cancel();
	}

	render(){

		this.logoutCall = APICalls.AuthCalls.logout();
		this.logoutCall.promise.then(response => {
			clearAPIKey();
			clearUser();
			clearProject();
			clearModel();
			history.push("/login/");
		});

		return null;
	}
}

export default SignOut;
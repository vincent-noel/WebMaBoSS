import React from "react";
import history from '../history';
import {clearAPIKey, clearUser} from "../commons/sessionVariables";
import APICalls from "../commons/apiCalls";


class SignOut extends React.Component {

	constructor(props) {
		super(props);
		this.logoutCall = null
	}

	componentWillUnmount() {
		if (this.logoutCall !== null) this.logoutCall.cancel();
	}

	render(){

		this.logoutCall = APICalls.logout();
		this.logoutCall.promise.then(response => {
			clearAPIKey();
			clearUser();
			history.push("/login/");
		});

		return null;
	}
}

export default SignOut;
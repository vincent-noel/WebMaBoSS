import React from "react";
import {clearAPIKey, clearUser} from "../commons/sessionVariables";

class SignOut extends React.Component {

	render(){

		const conf = {
		  method: "post",
		};

		fetch("/api/auth/logout", conf)
		.then(response => {
			clearAPIKey();
			clearUser();
			this.props.history.push("/login/");
		});

		return null;
	}
}

export default SignOut;
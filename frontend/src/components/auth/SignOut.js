import React from "react";
import {clearAPIKey} from "../commons/sessionVariables";

class SignOut extends React.Component {

	render(){

		const conf = {
		  method: "post",
		};

		fetch("/api/auth/logout", conf)
		.then(response => {
			clearAPIKey();
			this.props.history.push("/login/");
		});

		return null;
	}
}

export default SignOut;
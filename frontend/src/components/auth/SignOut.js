import React from "react";
import getCSRFToken from "../commons/getCSRFToken";


class SignOut extends React.Component {

	render(){

		const conf = {
		  method: "post",
		  headers: new Headers({
			  'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/logout/", conf)
		.then(response => {
			sessionStorage.clear();
			this.props.history.push("/login/");
		});

		return null;
	}
}

export default SignOut;
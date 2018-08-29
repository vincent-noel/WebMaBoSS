import React from "react";
import NavBarBrand from "./NavBarBrand";
import NavBarItem from "./NavBarItem";
import isConnected from "../commons/isConnected";


class NavBar extends React.Component {

	render(){

		// if (isConnected()) {
		//
		// 	const conf = {
		// 	  method: "get",
		// 	  headers: new Headers({
		// 		  'Authorization': "Token " + sessionStorage.getItem("api_key"),
		// 		  // 'X-CSRFToken': getCSRFToken()
		// 	  })
		// 	};
		//
		// 	fetch("/api/is_logged_in/", conf)
		// 	.then(response => response.json())
		// 	.then(response_json => { console.log(response_json); })
		//
		// }

		return (
			<nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
				<NavBarBrand/>
				{ isConnected() ? (
					<div className="collapse navbar-collapse" id="navbarsExampleDefault">
						<ul className="navbar-nav mr-auto">
							<NavBarItem url="/models/" name="Models"/>
							<NavBarItem url="/data/" name="Data"/>
						</ul>
					</div>
				) : (
					null
				)}

				<div className="collapse navbar-collapse" id="navbarsExampleDefault">
					<ul className="navbar-nav ml-auto">
						{ isConnected() ? (
							<React.Fragment>
								<NavBarItem url="/profile" name="Profile" />
								<NavBarItem url="/logout/" name="Logout" />
							</React.Fragment>
						) : (
							<React.Fragment>
								<NavBarItem url="/login/" name="Sign in"/>
								<NavBarItem url="/register/" name="Register" />
							</React.Fragment>

						)}
					</ul>
				</div>
			</nav>
		)
	}
}

export default NavBar;
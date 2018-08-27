import React from "react";
import NavBarBrand from "./NavBarBrand";
import NavBarItem from "./NavBarItem";

class NavBar extends React.Component {

	render(){
		return (
				<nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
					<NavBarBrand/>
					<div className="collapse navbar-collapse" id="navbarsExampleDefault">
						<ul className="navbar-nav mr-auto">
							<NavBarItem url="/models/" name="Models"/>
							<NavBarItem url="/data/" name="Data"/>
						</ul>
					</div>
					<div className="collapse navbar-collapse" id="navbarsExampleDefault">
						<ul className="navbar-nav ml-auto">
							<NavBarItem url="/profile/" name="Profile"/>
							<NavBarItem url="/settings/" name="Settings"/>
						</ul>
					</div>
				</nav>
		)
	}
}

export default NavBar;
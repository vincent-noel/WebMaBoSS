import React from "react";
import NavBarBrand from "./NavBarBrand";
import NavBarItem from "./NavBarItem";
import ProjectDropdown from "./ProjectDropdown";
import {isConnected} from "../commons/sessionVariables";
import {ProjectContext} from "../context";

class NavBar extends React.Component {

	render(){

		return (
			<nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
				<NavBarBrand/>
					<div className="collapse navbar-collapse" id="navbarsExampleDefault">
					<ul className="navbar-nav mr-auto">
						
					{ isConnected() && this.props.path !== "/" ? 
					
						<NavBarItem url="/models/" name="Models"/>
						// {/* <NavBarItem url="/data/" name="Data"/> */}
						: null
					}
		
					<NavBarItem url="/tutorials/" name="Tutorials"/>
					<NavBarItem url="/about/" name="About"/>
					
					</ul>
					</div>
						
					{ isConnected() && this.props.path !== "/" ?
						<div className="collapse navbar-collapse" id="navbarsExampleDefault">
							<ul className="navbar-nav mr-auto">
								<ProjectContext.Consumer>
								{(projectContext) => <ProjectDropdown
									path={this.props.path}
									project={projectContext.project}
									updateProject={projectContext.updateProject}
								/>}
								</ProjectContext.Consumer>
							</ul>
						</div> : null
					}
				

				<div className="collapse navbar-collapse" id="navbarsExampleDefault">
					<ul className="navbar-nav ml-auto">
						{ isConnected() ? (
							<React.Fragment>
								<NavBarItem url="/profile/account/" name="Profile" />
								<NavBarItem url="/logout/" name="Logout" />
							</React.Fragment>
						) : (
							<React.Fragment>
								<NavBarItem url="/models/" name="Demo"/>
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
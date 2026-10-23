import React, {Component} from "react";
import {NavLink} from "react-router-dom";

import APICalls from "../api/apiCalls";

class SideBar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			admin: false,
		};

		this.isAdminCall = null;
	}

	componentDidMount() {
		// The monitoring page is only for the administrators
		this.isAdminCall = APICalls.MonitoringCalls.isAdmin();
		this.isAdminCall.promise.then(admin => this.setState({admin: admin}));
	}

	componentWillUnmount() {
		if (this.isAdminCall !== null) { this.isAdminCall.cancel(); }
	}

	render(){
		return (
			<div id="sidebar-wrapper">
				<ul className="sidebar-nav">
					<li>
						<NavLink to={ "/profile/account/"}>Profile</NavLink>
					</li>
					<li>
						<NavLink to={"/profile/maboss/"}>MaBoSS</NavLink>
					</li>
					{this.state.admin ?
						<li>
							<NavLink to={"/profile/monitor/"}>Monitoring</NavLink>
						</li> : null
					}
				</ul>
			</div>
		)
	}
}

export default SideBar;

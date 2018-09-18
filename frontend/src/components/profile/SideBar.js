import React, {Component} from "react";
import {NavLink} from "react-router-dom";

class SideBar extends Component {

	render(){
		return (
			<div id="sidebar-wrapper">
				<ul className="sidebar-nav">
					<li>
						<NavLink to={ "/profile/"}>Profile</NavLink>
					</li>
					<li>
						<NavLink to={"/profile/maboss/"}>MaBoSS</NavLink>
					</li>
				</ul>
			</div>
		)
	}
}

export default SideBar;
import React from "react";
import {NavLink} from "react-router-dom";

class NavBarItem extends React.Component {

	render(){
		return (
			<li className="nav-item">
				<NavLink to={this.props.url} className='nav-link'>{this.props.name}</NavLink>
			</li>
		)
	}
}

export default NavBarItem;
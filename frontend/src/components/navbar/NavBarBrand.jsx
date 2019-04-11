import React from "react";
import {NavLink} from "react-router-dom";


class NavBarBrand extends React.Component {

	render(){
		return (
			<React.Fragment>
				<NavLink exact to="/" className='navbar-brand' activeClassName="active">WebMaBoSS</NavLink>
				<button className="navbar-toggler" type="button" data-toggle="collapse"
					data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
			</React.Fragment>
		)
	}
}

export default NavBarBrand;
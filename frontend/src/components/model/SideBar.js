import React from "react";
import {NavLink} from "react-router-dom";
import ModelDropdown from "./ModelDropdown";


class SideBar extends React.Component {

	render(){
		return (
			<div id="sidebar-wrapper">
				<ModelDropdown
					project={this.props.project}
					modelId={this.props.modelId}
					modelName={this.props.modelName}
					onModelChanged={this.props.onModelChanged}
					path={this.props.path}
				/>
				<br/>
				<ul className="sidebar-nav">
					<li>
						<NavLink to={"/model/overview/"} className='nav-link'>Overview</NavLink>
					</li>
					<li>
						<NavLink to={"/model/steady_states/"} className='nav-link'>Steady States</NavLink>
					</li>
					<li>
						<NavLink to={"/model/maboss/simulation/"} className='nav-link'>MaBoSS</NavLink>
						{/*{this.props.path.startsWith("/model/maboss/") ?*/}
						{/*<ul className={"sidebar-nav"}>*/}
							{/*<li>*/}
								{/*<NavLink to="/model/maboss/simulation/" className="nav-link">Simulation</NavLink>*/}
							{/*</li>*/}
							{/*<li>*/}
								{/*<NavLink to="/model/maboss/sensitivity/" className="nav-link">Sensitivity Analysis</NavLink>*/}
							{/*</li>*/}
						{/*</ul>*/}
						{/*: null}*/}
					</li>
				</ul>
			</div>
		)
	}
}

export default SideBar;
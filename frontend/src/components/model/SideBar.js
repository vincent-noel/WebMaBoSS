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
						<NavLink to={ "/model/"}>Overview</NavLink>
					</li>
					<li>
						<NavLink to={"/model/steady_states/"}>Steady States</NavLink>
					</li>
					<li>
						<NavLink to={"/model/maboss/"}>MaBoSS simulation</NavLink>
					</li>
				</ul>
			</div>
		)
	}
}

export default SideBar;
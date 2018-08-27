import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import ModelDropdown from "./ModelDropdown";

class SideBar extends Component {

	constructor(props){
		super(props);
		this.onModelChanged.bind(this);
	}

	onModelChanged(e, model_id) {

		this.props.onModelChanged(e, model_id);
	}

	render(){
		return (
			<div id="sidebar-wrapper">
				<ModelDropdown
					modelName={this.props.modelName}
					onModelChanged={(e, model_id) => this.props.onModelChanged(e, model_id)}
					path={this.props.path}
				/>
				<br/>
				<ul className="sidebar-nav">
					<li>
						<NavLink to={ "/model/" + this.props.modelId + "/"}>Overview</NavLink>
					</li>
					<li>
						<NavLink to={"/model/" + this.props.modelId + "/steady_states/"}>Steady States</NavLink>
					</li>
					<li>
						<NavLink to={"/model/" + this.props.modelId + "/maboss/"}>MaBoSS simulation</NavLink>
					</li>
				</ul>
			</div>
		)
	}
}

export default SideBar;
import React from "react";
import {NavLink} from "react-router-dom";
import { isConnected } from "../commons/sessionVariables";
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
					models={this.props.models}
					loaded={this.props.loaded}
					getModels={this.props.getModels}
				/>
				<br/>
				<ul className="sidebar-nav">
					<li>
						<NavLink to={"/model/overview/"} className='nav-link'>Overview</NavLink>
					</li>
					{/* <li>
						<NavLink to={"/model/fixed_points/"} className='nav-link'>Fixed points</NavLink>
					</li>
					<li>
						<NavLink to={"/model/maboss/simulation/"} className='nav-link'>MaBoSS</NavLink>
						{
							this.props.path.startsWith("/model/maboss/") ? */}
							{/* <ul className={"sidebar-nav"}> */}
								{ isConnected() ? <li>
									<NavLink to="/model/maboss/editing/" className="nav-link">Editing</NavLink>
								</li> : null }
								<li>
									<NavLink to="/model/maboss/simulation/" className="nav-link">Simulation</NavLink>
								</li>
								{ isConnected() ? <li>
									<NavLink to="/model/maboss/sensitivity/" className="nav-link">Sensitivity</NavLink>
								</li> : null }
							{/* </ul>
							: null}
					</li> */}
				</ul>
			</div>
		)
	}
}

export default SideBar;
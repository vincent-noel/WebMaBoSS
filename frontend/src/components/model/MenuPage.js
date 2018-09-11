import React from "react";

import SideBar from "./SideBar";
import Page from "../Page";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {getAPIKey, getModel, getProject} from "../commons/sessionVariables";

class MenuPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			toggled : true,
			modelId: getModel(),
			modelName: undefined
		};

		this.getName(getModel());

		this.toggle.bind(this);
		this.onModelChanged.bind(this);
	}

	getName(modelId) {
		fetch(
			"/api/logical_model/" + getProject() + "/" + modelId + "/name",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {return response.json()})
		.then(data => {this.setState({modelName: data['name']})});
	}

	toggle(e) {
		this.setState({toggled: !this.state.toggled});
	}

	onModelChanged(e, id) {
		this.setState({modelId: id});
		this.getName(id);
	}

	render() {
		return (
			<Page path={this.props.path}>
				<div id="wrapper" className={this.state.toggled?"toggled":""}>
					<SideBar
						modelId={this.state.modelId} modelName={this.state.modelName}
						onModelChanged={(e, id) => this.onModelChanged(e, id)}
						path={this.props.path}
					/>
					<div id="page-content-wrapper">
    					{React.Children.map(
    						this.props.children,
							(child => React.cloneElement(child, {
								modelId: this.state.modelId,
								modelName: this.state.modelName
							}))
						)}
					</div>
					<a className="btn btn-secondary" id="menu-toggle" onClick={(e) => this.toggle(e)} >
						<FontAwesomeIcon icon={faBars} />
					</a>
				</div>
			</Page>
		);
	}
}

export default MenuPage;
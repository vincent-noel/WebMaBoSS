import React from "react";

import Page from "./Page";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {getProject} from "./commons/sessionVariables";

class MenuPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			toggled : true,
			project: getProject()
		};

		this.toggle.bind(this);
		this.updateProject = this.updateProject.bind(this);
	}

	toggle(e) {
		this.setState({toggled: !this.state.toggled});
	}

	updateProject(project) {
		this.setState({project: project})
	}

	render() {
		return (
			<Page path={this.props.path} updateProject={this.updateProject}>
				<div id="wrapper" className={this.state.toggled?"toggled":""}>
					{this.props.sidebar}
					<div id="page-content-wrapper">
						{this.props.children}
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
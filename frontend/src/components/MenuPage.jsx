import React from "react";

import Page from "./Page";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import "../scss/sidebar.scss";


class MenuPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			toggled : true,
		};

		this.toggle.bind(this);
	}

	toggle(e) {
		this.setState({toggled: !this.state.toggled});
	}

	render() {

		return (
			<Page path={this.props.path}>
				<div id="wrapper" className={this.state.toggled?"toggled":""}>
					{this.props.sidebar}
					<div id="page-content-wrapper">
						{this.props.children}
					</div>
					<a className="btn btn-secondary" id="menu-toggle" onClick={(e) => this.toggle(e)} style={{color: "white"}}>
						<FontAwesomeIcon icon={faBars} />
					</a>
				</div>
			</Page>
		);
	}
}

export default MenuPage;
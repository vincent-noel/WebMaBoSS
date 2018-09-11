import React from "react";
import NavBar from "./navbar/NavBar";
import PropTypes from "prop-types";


class Page extends React.Component {

	static propTypes = {
		path: PropTypes.string.isRequired,
	};

	render() {
		const page_style = { 'paddingTop': '3.5rem' };
		return (
			<div className="container-fluid">
				<NavBar path={this.props.path} updateProject={this.props.updateProject}/>
				<div className="page" style={page_style}>{this.props.children}</div>
			</div>
		);
	}
}

export default Page;
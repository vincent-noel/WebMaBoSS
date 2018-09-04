import React from "react";
import NavBar from "./navbar/NavBar";


class Page extends React.Component {

	render() {
		const page_style = { 'paddingTop': '5rem' };
		return (
			<div className="container">
				<NavBar/>
				<div className="page" style={page_style}>{this.props.children}</div>
			</div>
		);
	}
}

export default Page;
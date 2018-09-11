import React from "react";
import Page from "./Page";

class FullPage extends React.Component {

	render() {
		return (
			<Page path={this.props.path} updateProject={this.props.updateProject}>
				<div className="container" style={{paddingTop: '1.5rem'}}>
					{this.props.children}
				</div>
			</Page>
		);
	}
}

export default FullPage;
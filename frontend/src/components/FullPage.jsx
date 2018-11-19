import React from "react";
import Page from "./Page";

class FullPage extends React.Component {

	render() {
		return (
			<Page path={this.props.path}>
				<div>
					<div className="container fullpage">
						{this.props.children}
					</div>
				</div>
			</Page>
		);
	}
}

export default FullPage;
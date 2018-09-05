import React from "react";
import Page from "./Page";

class FullPage extends React.Component {

	render() {
		return (
			<Page>
				<div style={{paddingTop: '1.5rem'}}>
					{this.props.children}
				</div>
			</Page>
		);
	}
}

export default FullPage;
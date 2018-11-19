import React from "react";
import FullPage from "./FullPage";

class Data extends React.Component {

	render(){
		return <FullPage path={this.props.match.path}/>;
	}
}

export default Data;
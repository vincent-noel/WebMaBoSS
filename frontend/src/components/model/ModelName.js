import React, {Component} from "react";
import LoadingIcon from "../commons/LoadingIcon";

class ModelName extends Component {

	constructor(props) {
		super(props);

		this.state = {
			placeholder: "Loading..."
		};
	}

	render() {
		return (
			<React.Fragment>
				{this.props.modelName !== null ?
					<h1>Model {this.props.modelName}</h1> :
					<LoadingIcon width="1rem"/>
				}
				<br/>
			</React.Fragment>
		);
	}
}

export default ModelName;
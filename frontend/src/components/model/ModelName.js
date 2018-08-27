import React, {Component} from "react";

class ModelName extends Component {

	constructor(props) {
		super(props);

		this.state = {
			placeholder: "Loading..."
		};
	}

	render() {
		let modelName = this.state.placeholder;

		if (this.props.modelName !== undefined) {
			modelName = this.props.modelName;
		}

		return (
			<React.Fragment>
				<h1>Model {modelName}</h1>
				<br/>
			</React.Fragment>
		);
	}
}

export default ModelName;
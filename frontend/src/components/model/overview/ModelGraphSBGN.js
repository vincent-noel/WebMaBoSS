import React from "react";
// import "sbgnviz";

class ModelGraphSBGN extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
		};

		this.mounted = false;

	}

	getGraph(modelId) {
		// Getting the graph via the API

		fetch("/api/logical_model/" + modelId + "/graph_raw/")
		.then(response => {	return response.json(); })
		.then(
			data => { this.setState({loaded: true, data: data})}
		)

	}


	componentDidMount() {
		this.mounted = true;
		this.getGraph(this.props.modelId);
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.modelId !== this.props.modelId) {
			this.setState({loaded: false});
			this.getGraph(nextProps.modelId);
			return false;

		}
		return true;
	}

	render() {

		if (this.state.loaded) {

			return (
				<div>

				</div>
			);

		} else {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />;
		}

	}
}

export default ModelGraphSBGN;
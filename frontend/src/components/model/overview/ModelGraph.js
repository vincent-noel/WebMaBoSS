import React, {Component} from "react";
import {getAPIKey} from "../../commons/sessionVariables";

class ModelGraph extends Component {

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

		fetch(
			"/api/logical_model/" + this.props.project + "/" + modelId + "/graph",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {	return response.blob(); })

		// toBase64
		.then(
			blob => new Promise((resolve, reject) => {
				const reader = new FileReader;
				reader.onerror = reject;
				reader.onload = () => {
					resolve(reader.result);
				};
				reader.readAsDataURL(blob);
			})
		)

		// Finally, setting state
		.then(
			data => {
				if (this.mounted) this.setState({data: data, loaded: true});
			}
		);
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
			const style_image = {
				'maxWidth': '100%',
				'maxHeight': '100%'
			};
			return <img src={this.state.data} style={style_image} />
		} else {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />;
		}

	}
}

export default ModelGraph;
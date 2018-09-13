import React, {Component} from "react";
import {getAPIKey, getProject} from "../../commons/sessionVariables";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import LoadingIcon from "../../commons/LoadingIcon";


class Graph extends Component {

	constructor(props) {
		super(props);

		this.state = {
			graph: null,
		};
	}

	getGraph(steady_state) {

		this.setState({graph: null});

		const body = new FormData();
		body.append('steady_state', JSON.stringify(steady_state));

		fetch(
			"/api/logical_model/" + this.props.project + "/" + this.props.modelId + "/graph",
			{
				method: "post",
				body: body,
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
		.then(data => {	this.setState({graph: data, loaded: true})});
	}

	componentDidMount() {
		this.getGraph(this.props.steadyState);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.steadyState !== this.props.steadyState) {
			this.getGraph(nextProps.steadyState);
			return false;
		}
		return true;
	}

	render() {
		if (this.state.graph !== null) {
			return <img
				src={this.state.graph}
				style={{
					'maxWidth': '100%',
					'maxHeight': '100%'
				}}
			/>;
		} else return <LoadingIcon width={"200px"}/>;
	}
}

export default Graph;
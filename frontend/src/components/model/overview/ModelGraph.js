import React, {Component} from "react";
import LoadingIcon from "../../commons/LoadingIcon";
import {APICalls} from "../../commons/apiCalls";


class ModelGraph extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
		};

		this.getGraphCall = null;
	}

	getGraph(project_id, model_id) {
		this.setState({loaded: false, data: null});

		this.getGraphCall = APICalls.getGraph(project_id, model_id);
		this.getGraphCall.promise.then(data => this.setState({data: data, loaded: true}));
	}


	componentDidMount() {
		this.getGraph(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		this.getGraphCall.cancel();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.project !== this.props.project) {
			return false;
		}

		if (nextProps.modelId !== this.props.modelId) {
			this.getGraphCall.cancel();
			this.setState({loaded: false});
			this.getGraph(nextProps.project, nextProps.modelId);
			return false;

		}
		return true;
	}

	render() {

		if (this.state.loaded) {
			return <img src={this.state.data} className="fullsize" />
		} else {
			return <LoadingIcon width="3rem"/>;
		}

	}
}

export default ModelGraph;
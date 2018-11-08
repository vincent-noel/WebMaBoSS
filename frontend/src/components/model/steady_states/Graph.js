import React, {Component} from "react";
import LoadingIcon from "../../commons/LoadingIcon";
import APICalls from "../../api/apiCalls";

class Graph extends Component {

	constructor(props) {
		super(props);

		this.state = {
			graph: null,
		};

		this.getGraphCall = null;
	}

	getGraph(project_id, model_id, steady_state) {

		this.setState({graph: null});

		this.getGraphCall = APICalls.ModelCalls.getSteadyStatesGraph(project_id, model_id, steady_state);
		this.getGraphCall.promise.then(data => this.setState({graph: data, loaded: true}));
	}

	componentDidMount() {
		this.getGraph(this.props.project, this.props.modelId, this.props.steadyState);
	}

	componentWillUnmount() {
		if (this.getGraphCall !== null)	this.getGraphCall.cancel();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.steadyState !== this.props.steadyState) {
			if (this.getGraphCall !== null) this.getGraphCall.cancel();
			this.getGraph(nextProps.project, nextProps.modelId, nextProps.steadyState);
			return false;
		}
		return true;
	}

	render() {
		if (this.state.graph !== null) {
			return <img
				src={this.state.graph}
				className="fullsize"
			/>;
		} else return <LoadingIcon width="3rem"/>;
	}
}

export default Graph;
import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadingIcon from "../commons/LoadingIcon";
import APICalls from "../commons/apiCalls";

class LogicalModels extends Component {
	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		render: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.updateParent = this.updateParent.bind(this);

		this.state = {
			data: [],
			loaded: false,
		};
		this.getModelsCall = null;
	}

	updateParent() {
		this.getModelsCall.cancel();
		this.getData(this.props.project);
	}

	getData(project_id){
		this.setState({data: [], loaded: false});
		this.getModelsCall = APICalls.getModels(project_id);
		this.getModelsCall.promise.then(data => this.setState({ data: data, loaded: true }));
	}
	componentDidMount() {
		this.getData(this.props.project);
	}

	componentWillUnmount() {
		if (this.getModelsCall !== null) this.getModelsCall.cancel();
	}


	render() {
		if (this.state.loaded) {
			return this.props.render(this.state.data, this.updateParent, this.props.project);

		} else {
			return <LoadingIcon width="3rem"/>
		}
	}
}
export default LogicalModels;
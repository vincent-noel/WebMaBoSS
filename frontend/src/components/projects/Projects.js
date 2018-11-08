import React from "react";
import PropTypes from "prop-types";
import LoadingIcon from "../commons/LoadingIcon";
import APICalls from "../api/apiCalls";


class Projects extends React.Component {
	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		render: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.updateProjects = this.updateProjects.bind(this);

		this.state = {
			data: [],
			loaded: false,
		};

		this.getProjectsCall = null;
	}

	updateProjects(){
		if (this.getProjectsCall !== null) this.getProjectsCall.cancel();

		this.setState({data: [], loaded: false});
		this.getProjectsCall = APICalls.ProjectCalls.getProjects();
		this.getProjectsCall.promise.then(data => this.setState({ data: data, loaded: true }));
	}
	componentDidMount() {
		this.updateProjects();
	}

	componentWillUnmount() {
		if (this.getProjectsCall !== null) this.getProjectsCall.cancel();
	}
	render() {
		if (this.state.loaded) {
			return this.props.render(this.state.data, this.updateProjects)

		} else {
			return <LoadingIcon width="3rem"/>
		}
	}
}
export default Projects;
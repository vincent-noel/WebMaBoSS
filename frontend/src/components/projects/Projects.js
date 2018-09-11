import React from "react";
import PropTypes from "prop-types";
import {getAPIKey} from "../commons/sessionVariables";


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
			placeholder: "Loading...",

		};
	}

	updateProjects(){
		fetch(
			this.props.endpoint,
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {
			if (response.status !== 200) {
				return this.setState({ placeholder: "Something went wrong" });
			}
			return response.json();
		})
		.then(data => this.setState({ data: data, loaded: true }));
	}
	componentDidMount() {
		this.updateProjects();
	}
	render() {
		if (this.state.loaded) {
			return this.props.render(this.state.data, this.updateProjects)

		} else {
			return <p>{this.state.placeholder}</p>
		}
	}
}
export default Projects;
import React from "react";
import PropTypes from "prop-types";
import AddProjectForm from "./AddProjectForm";


class Projects extends React.Component {
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
			placeholder: "Loading..."
		};
	}

	updateParent() {
		this.getData();
	}

	getData(){
		fetch(
			this.props.endpoint,
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + sessionStorage.getItem("api_key")
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
		this.getData();
	}
	render() {
		const { data, loaded, placeholder } = this.state;
		return <div>
			{loaded ? this.props.render(data, this.updateParent) : <p>{placeholder}</p>}
			<AddProjectForm updateParent={this.updateParent} />
		</div>;
	}
}
export default Projects;
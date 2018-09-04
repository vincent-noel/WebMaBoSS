import React, { Component } from "react";
import PropTypes from "prop-types";
import AddModelForm from "./AddModelForm";


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
			placeholder: "Loading the list of models"
		};
	}

	updateParent() {
		this.getData();
	}

	getData(){
		fetch(
			this.props.endpoint + sessionStorage.getItem('project') + "/",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + sessionStorage.getItem("api_key")
				}),
			}
		)
		.then(response => {
			if (response.status !== 200) {
				return this.setState({ placeholder: "Unable to get the list of models" });
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
		return (

		<div>
			{loaded ? this.props.render(data, this.updateParent) : <p>{placeholder}</p>}
			<AddModelForm updateParent={this.updateParent} />
		</div>);
	}
}
export default LogicalModels;
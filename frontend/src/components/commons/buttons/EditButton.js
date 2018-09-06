import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import {getAPIKey} from "../sessionVariables";

class EditButton extends Component {

	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
		edit: PropTypes.func.isRequired,
		update: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.edit = this.edit.bind(this);
	}

	edit() {
		fetch(this.props.endpoint + this.props.id, {
			method: "get",
		  	headers: new Headers({'Authorization': "Token " + getAPIKey() })
		})
		.then(response => response.json())
		.then(json_response => {
			this.props.edit(json_response);
		});
	}

  	render() {
  		return (
				<button type="submit" className="btn btn-primary ml-1" onClick={this.edit}>
					<FontAwesomeIcon icon={faEdit} size="sm"/>
				</button>
		);
  	}
}
export default EditButton;
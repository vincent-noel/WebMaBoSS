import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import {getAPIKey} from "../sessionVariables";

class DeleteButton extends Component {

	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
		update: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.delete = this.delete.bind(this);
	}

	delete() {
		fetch(this.props.endpoint + this.props.id, {
			method: "delete",
		  	headers: new Headers({'Authorization': "Token " + getAPIKey()})
		})
		.then(response => { this.props.update();});
  	}

  	render() {

		return (
				<button type="submit" className="btn btn-danger ml-1" onClick={this.delete}>
					<FontAwesomeIcon icon={faTrash} size="sm" />
				</button>
		);
	}
}
export default DeleteButton;
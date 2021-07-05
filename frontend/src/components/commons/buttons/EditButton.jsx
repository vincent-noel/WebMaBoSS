import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import APICalls from "../../api/apiCalls";

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
		this.editCall = null;
	}

	edit() {
		this.editCall = APICalls.GenericCalls.editById(this.props.endpoint, this.props.id);
		this.editCall.promise.then(json_response => this.props.edit(json_response));
	}

	componentWillUnmount(){
		if (this.editCall !== null) this.editCall.cancel();
	}

  	render() {
  		return (
				<button type="submit" title={this.props.title ? this.props.title : "Edit"}
						className={"btn btn-primary ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={this.edit}>
					<FontAwesomeIcon icon={faEdit} size={this.props.size !== undefined ? this.props.size : null}/>
				</button>
		);
  	}
}
export default EditButton;
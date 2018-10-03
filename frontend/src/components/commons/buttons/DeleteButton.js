import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import APICalls from "../apiCalls";

class DeleteButton extends Component {

	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		update: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.delete = this.delete.bind(this);
		this.deleteCall = null;
	}

	delete() {
		this.deleteCall = APICalls.deleteById(this.props.endpoint, this.props.id);
		this.deleteCall.promise.then(response => { this.props.update();});
  	}

  	componentWillUnmount() {
		if (this.deleteCall !== null) this.deleteCall.cancel();
	}

  	render() {

		return (
				<button type="submit"
						className={"btn btn-danger ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={this.delete}>
					<FontAwesomeIcon
						icon={faTrash}
						size={this.props.size !== undefined ? this.props.size : null} />
				</button>
		);
	}
}
export default DeleteButton;
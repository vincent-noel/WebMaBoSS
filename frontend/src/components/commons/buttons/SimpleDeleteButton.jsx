import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import APICalls from "../../api/apiCalls";

class SimpleDeleteButton extends Component {

	static propTypes = {
		onClick: PropTypes.func.isRequired
	};

  	render() {

		return (
				<button type="submit"
						className={"btn btn-danger ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={this.props.onClick}>
					<FontAwesomeIcon
						icon={faTrash}
						size={this.props.size !== undefined ? this.props.size : null} />
				</button>
		);
	}
}
export default SimpleDeleteButton;
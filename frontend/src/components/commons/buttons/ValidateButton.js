import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

class ValidateButton extends Component {

	static propTypes = {
		onClick: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
	}

  	render() {
  		return (
				<button type="submit"
						className={"btn btn-success ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={this.props.onClick}>
					<FontAwesomeIcon icon={faCheck} size={this.props.size !== undefined ? this.props.size : null}/>
				</button>
		);
  	}
}
export default ValidateButton;
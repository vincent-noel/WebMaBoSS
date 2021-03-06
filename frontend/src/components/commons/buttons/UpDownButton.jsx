import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

class UpDownButton extends Component {

	static propTypes = {
		id: PropTypes.number.isRequired,
		status: PropTypes.bool.isRequired,
		onClick: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
	}

  	render() {
  		return (
				<button
						className={"btn btn-primary ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={(e) => this.props.onClick(this.props.id)}>
					<FontAwesomeIcon
						icon={this.props.status ? faChevronUp : faChevronDown}
						size={this.props.size !== undefined ? this.props.size : null}
					/>
				</button>
		);
  	}
}
export default UpDownButton;
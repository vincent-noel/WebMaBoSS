import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

class CancelButton extends Component {

	static propTypes = {
		onClick: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
	}

  	render() {
  		return (
				<button type="submit" title={this.props.title ? this.props.title : "Cancel"}
						className={"btn btn-danger ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={this.props.onClick}>
					<FontAwesomeIcon icon={faTimes} size={this.props.size !== undefined ? this.props.size : null}/>
				</button>
		);
  	}
}
export default CancelButton;
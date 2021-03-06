import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

class SimpleAddButton extends Component {

	static propTypes = {
		onClick: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
	}

  	render() {
  		return (
				<button type="submit"
						className={"btn btn-primary ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={this.props.onClick}
						disabled={this.props.disabled !== null ? this.props.disabled : false }
				>
					<FontAwesomeIcon icon={faPlus} size={this.props.size !== undefined ? this.props.size : null}/>
				</button>
		);
  	}
}
export default SimpleAddButton;
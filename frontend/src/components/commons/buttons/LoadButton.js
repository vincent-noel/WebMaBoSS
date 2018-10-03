import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import APICalls from "../apiCalls";

class LoadButton extends Component {

	static propTypes = {
		id: PropTypes.number.isRequired,
		load: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
	}

  	render() {
  		return (
				<button type="submit"
						className={"btn btn-primary ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={(e) => this.props.load(this.props.id)}>
					<FontAwesomeIcon icon={faFileUpload} size={this.props.size !== undefined ? this.props.size : null}/>
				</button>
		);
  	}
}
export default LoadButton;
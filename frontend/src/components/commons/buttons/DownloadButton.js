import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";


class DownloadButton extends Component {

	static propTypes = {
		onClick: PropTypes.func.isRequired
	};

  	render() {
		return (
				<button type="button" className="btn btn-info ml-1" onClick={this.props.onClick}>
					<FontAwesomeIcon icon={faSave} />
				</button>
		);
  	}
}
export default DownloadButton;
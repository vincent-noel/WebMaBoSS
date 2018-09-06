import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {saveAs} from "file-saver/FileSaver";
import PropTypes from "prop-types";
import {getAPIKey} from "../sessionVariables";


class DownloadButton extends Component {

	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		filename: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
	};

	constructor(props) {
		super(props);
		this.download = this.download.bind(this);
	}

	download() {
		fetch(this.props.endpoint + this.props.id + "/file", {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()}),
		})
		.then(response => response.blob())
		.then(blob => saveAs(blob, this.props.filename));
	}

  	render() {
		return (
				<button type="button" className="btn btn-info ml-1" onClick={this.download}>
					<FontAwesomeIcon icon={faSave} />
				</button>
		);
  	}
}
export default DownloadButton;
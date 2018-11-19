import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";


class TagButton extends Component {

	static propTypes = {
		id: PropTypes.number.isRequired,
		tag: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		// this.tag = this.tag.bind(this);
		this.tagCall = null;
	}

	componentWillUnmount(){
		if (this.tagCall !== null) this.tagCall.cancel();
	}

  	render() {
  		return (
				<button type="submit"
						className={"btn btn-primary ml-1" + (this.props.size !== undefined ? " btn-" + this.props.size : "")}
						onClick={() => this.props.tag(this.props.id, this.props.filename)}>
					<FontAwesomeIcon icon={faTag} size={this.props.size !== undefined ? this.props.size : null}/>
				</button>
		);
  	}
}
export default TagButton;
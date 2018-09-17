import React, { Component } from "react";
import PropTypes from "prop-types";

class Range extends Component {

	// static propTypes = {
	// 	checked: PropTypes.bool.isRequired,
	// 	updateCallback: PropTypes.func.isRequired,
	// 	id: PropTypes.string.isRequired,
	// };

	constructor (props) {
		super(props);

		this.state = {
			value: this.props.value,
		}
	}

	changeValue(value) {
		this.setState({value: value});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.value !== this.state.value){
			this.props.updateCallback(nextState.value);
		}

		return true;
	}

  	render() {
  		return <label className="range">
			<input type="range" className="slider"
				   id={this.props.id + "slider"}
				   onChange={(e) => {this.changeValue(e.target.value)}}
				   value={this.props.value}
			/>
		</label>;
  	}
}
export default Range;
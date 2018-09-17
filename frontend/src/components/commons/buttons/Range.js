import React, { Component } from "react";
import PropTypes from "prop-types";

class Range extends Component {

	static propTypes = {
		value: PropTypes.number.isRequired,
		updateCallback: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
	};

	constructor (props) {
		super(props);

		this.state = {
			value: this.props.value,
		}
	}

	changeValue(value) {
		this.setState({value: value/100});
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
				   defaultValue={this.props.value*100}
			/>
		</label>;
  	}
}
export default Range;
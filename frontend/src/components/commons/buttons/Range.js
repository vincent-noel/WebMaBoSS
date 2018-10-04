import React, { Component } from "react";
import PropTypes from "prop-types";
import '../../../scss/toggle_switch.scss';

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
		this.setState({value: parseInt(value)});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.value !== this.state.value){
			this.props.updateCallback(nextState.value);
		}

		return true;
	}

  	render() {
  		return <React.Fragment>
			<label className="range" data-toggle="tooltip"
					data-placement="top"
					title={this.props.value + " %"}
			>
				<input type="range" className="slider"
					   min="0" max="100" step="1"
					   id={this.props.id + "slider"}
					   onChange={(e) => {this.changeValue(e.target.value)}}
					   defaultValue={this.props.value}
				/>
			</label>
			<span className="range-indicator">{this.props.value + "%"}</span>
		</React.Fragment>;
  	}
}
export default Range;
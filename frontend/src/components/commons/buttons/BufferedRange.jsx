import React, { Component } from "react";
import PropTypes from "prop-types";
import '../../../scss/toggle_switch.scss';

class BufferedRange extends Component {

	static propTypes = {
		updateCallback: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
	};

	constructor (props) {
		super(props);

		this.state = {
			value: this.props.value,
		};
	}

	handleChangeValue(value) {
		clearTimeout(this.timer);

		this.setState({value: value});

		this.timer = setTimeout(() => this.changeValue(value), this.props.buffer);
	}

	changeValue(value) {
		this.props.updateCallback(value);
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
					   onChange={(e) => {this.handleChangeValue(e.target.value)}}
					   defaultValue={this.props.value}
				/>
			</label>
			<span className="range-indicator">{this.props.value + "%"}</span>
		</React.Fragment>;
  	}
}
export default BufferedRange;
import React, { Component } from "react";
import PropTypes from "prop-types";
import '../../../scss/toggle_switch.scss';

class BufferedTextField extends Component {

	static propTypes = {
		onValueChange: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,

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
		this.props.onValueChange(value);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.value !== this.props.value) {
			this.setState({value: nextProps.value});
			return false;
		}

		return true;
	}

  	render() {
  		return <input
			id={this.props.name} name={this.props.name} ref={this.props.inputRef}
			type="text" value={this.state.value}
			className={"form-control" + (this.props.error !== "" ?" is-invalid":"")}
			onChange={(e) => this.handleChangeValue(e.target.value)}
			disabled={this.props.disabled}
		/>;
  	}
}
export default BufferedTextField;
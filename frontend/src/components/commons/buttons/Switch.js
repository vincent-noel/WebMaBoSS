import React, { Component } from "react";
import PropTypes from "prop-types";

class Switch extends Component {

	static propTypes = {
		checked: PropTypes.bool.isRequired,
		updateCallback: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
	};

	constructor (props) {
		super(props);

		this.state = {
			checked: this.props.checked,
		}
	}

	toggle() {
		this.setState((state) => { return {checked: !state.checked}});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.checked !== this.state.checked){
			this.props.updateCallback(nextState.checked);
		}

		return true;
	}

  	render() {
  		return <label className="switch">
			<input
				type="checkbox"
				defaultChecked={this.state.checked}
				onClick={() => this.toggle()}
			/>
			<span className="slider round"/>
		</label>;
  	}
}
export default Switch;
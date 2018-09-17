import React, { Component } from "react";
import PropTypes from "prop-types";

class Switch3Pos extends Component {

	static propTypes = {
		updateCallback: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			selected: this.props.value,
		}
	}

	changeState(state) {
		this.setState({selected: state});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.selected !== this.state.selected) {
			this.props.updateCallback(nextState.selected);
		}

		return true;
	}


  	render() {
  		return <div className="switch-3">
			<input
				id={this.props.id + "-off"}
				name={"state-d" + this.props.id}
				type="radio"
				{ ...(this.state.selected === 'off' ? {defaultChecked: true} : null) }
				onClick={() => this.changeState('off')}
			/>
			<label htmlFor={this.props.id + "-off"} className="switch-3-label-off"/>
			<input
				id={this.props.id + "-na"}
				name={"state-d" + this.props.id}
				type="radio"
				{ ...(this.state.selected === 'na' || this.state.selected === null ? {defaultChecked: true} : null) }
				onClick={() => this.changeState('na')}
			/>
			<label htmlFor={this.props.id + "-na"} className="switch-3-label-na"/>
			<input
				id={this.props.id + "-on"}
				name={"state-d" + this.props.id}
				type="radio"
				{ ...(this.state.selected === 'on' ? {defaultChecked: true} : null) }
				onClick={() => this.changeState('on')}
			/>
			<label htmlFor={this.props.id + "-on"} className="switch-3-label-on"/>
			<span className="slider-3 round" />
		</div>;
  	}
}
export default Switch3Pos;
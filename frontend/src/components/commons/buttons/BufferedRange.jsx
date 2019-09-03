import React, { Component } from "react";
import PropTypes from "prop-types";
import '../../../scss/toggle_switch.scss';
import LoadingIcon from "../loaders/LoadingIcon";

class BufferedRange extends Component {

	static propTypes = {
		updateCallback: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
	};

	constructor (props) {
		super(props);

		this.state = {
			value: this.props.value,
			waiting: false
		};
	}

	handleChangeValue(value) {
		clearTimeout(this.timer);

		this.setState({value: value});

		this.timer = setTimeout(() => this.changeValue(value), this.props.buffer);
	}

	changeValue(value) {
		this.props.updateCallback(value);
		this.setState({waiting: true});
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {

		if (nextProps.value !== this.props.value && this.state.waiting) {
			this.setState({waiting: false});
			return false;
		}

		if (nextProps.waiting !== this.state.waiting) {
			this.setState({waiting: nextProps.waiting});
			return false;
		}

		return true;
	}

	render() {
  		return <React.Fragment>
			<label className="range" data-toggle="tooltip"
					data-placement="top"
					title={(isNaN(this.props.value)) ? "" : this.props.value + " %"}
			>
				<input type="range" className="slider"
					   min="0" max="100" step="1"
					   id={this.props.id + "slider"}
					   onChange={(e) => {this.handleChangeValue(e.target.value)}}
					   value={(isNaN(this.props.value)) ? 50 : this.props.value}
					   disabled={isNaN(this.props.value)}
				/>
			</label>
			{ this.state.waiting ?
				<span style={{width: "3rem"}}><LoadingIcon width={"1rem"}/></span> :
				<span style={{width: "3rem"}} className="range-indicator">{(isNaN(this.props.value)) ? "" : this.props.value + "%"}</span>
			}
		</React.Fragment>;
  	}
}
export default BufferedRange;
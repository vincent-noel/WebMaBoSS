import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";
import APICalls from "../../../api/apiCalls";
import LoadingInlineIcon from "../../../commons/loaders/LoadingInlineIcon";

class MaBoSSSettingsForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			value: "",
			valueError: "Please provide a value",

			showErrors: false,
			waitSubmit: false,
		};


		this.inputValueRef = React.createRef();
	}

	onValueChange(value) {
		this.setState({value: value});
		this.checkParameterValue(value);
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.state.valueError !== "") {
			this.setState({showErrors: true});

			if (this.state.valueError !== "") {
				this.inputValueRef.current.focus();
			}

		} else {
			this.setState({showErrors: false});
			this.props.submit(
				this.props.name,
				this.state.value
			);
		}

	}

	checkParameterValue(value) {

		if (value === "") {
			this.setState({valueError: "Please provide a value"});
		} else if (isNaN(value)) {
			this.setState({valueError: "Not a number"});
		} else {
			this.setState({valueError: ""});
		}
	}


	componentDidMount() {
		this.checkParameterValue(this.state.value);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.status !== this.props.status) {
			this.setState({valueError: "", showErrors: false});
		}

		if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
			this.setState({value: nextProps.value})
		}

		return true;
	}

	render() {

		const errors = [];

		if (this.state.valueError !== "") {
			errors.push(this.state.valueError);
		}

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form>
				<Card>
					<CardHeader>Editing setting {this.props.name}</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={errors}/> : null}
						<div className="form-group">
							<label htmlFor="value">Value</label>
							<input
								id="value" name="value" ref={this.inputValueRef}
								type="text" value={this.state.value}
								className={"form-control" + (this.state.valueError !== "" ?" is-invalid":"")}
								onChange={(e) => this.onValueChange(e.target.value)}/>
						</div>

					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="mr-auto" onClick={() => this.props.toggle()}>Close</Button>
							<Button
								type="submit" color="default" className="ml-auto"
								onClick={(e) => this.onSubmit(e)} disabled={this.state.waitSubmit}
							>Submit {this.state.waitSubmit ? <LoadingInlineIcon width="1rem"/> : null}</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
				</form>
			</Modal>
		);
	}
}

export default MaBoSSSettingsForm;
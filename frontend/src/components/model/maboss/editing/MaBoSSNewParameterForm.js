import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";

class MaBoSSNewParameterForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			value: "",

			nameError: "Please provide a name",
			valueError: "Please provide a value",

			showErrors: false,
		};

		this.inputNameRef = React.createRef();
		this.inputValueRef = React.createRef();
	}

	onNameChange(name) {
		this.setState({name: name});
		this.checkParameterName(name);
	}

	onValueChange(value) {
		this.setState({value: value});
		this.checkParameterValue(value);
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.state.nameError !== "" || this.state.valueError !== "") {
			this.setState({showErrors: true});

			if (this.state.nameError !== "") {
				this.inputNameRef.current.focus();
			}
			if (this.state.valueError !== "") {
				this.inputValueRef.current.focus();
			}

		} else {
			this.setState({showErrors: false});
			this.props.submit(this.state.name, this.state.value);
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

	checkParameterName(name) {
		if (value === "") {
			this.setState({nameError: "Please provide a name"});
		} else if (Object.keys(this.props.parameters).includes(name)) {
			this.setState({nameError: "Parameter " + name + " already exists"});
		} else if (!name.startsWith("$")) {
			this.setState({nameError: "Parameter name must start with a '$'"});
		} else  {
			this.setState({nameError: ""});

		}

	}

	render() {

		const errors = [];
		if (this.state.nameError !== "") {
			errors.push(this.state.nameError);
		}

		if (this.state.valueError !== "") {
			errors.push(this.state.valueError);
		}

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form>
				<Card>
					<CardHeader>Editing parameter value</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={ this.state.nameError !== "" || this.state.valueError !== "" ? errors : []}/> : null}
						<div className="form-group">
							<label htmlFor="name">Name</label>
							<input
								id="name" name="name" ref={this.inputNameRef}
								type="text" value={this.state.name}
								className={"form-control" + (this.state.nameError !== "" ?" is-invalid":"")}
								onChange={(e) => this.onNameChange(e.target.value)}
							/>
						</div>
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
							<Button type="submit" color="default" className="ml-auto" onClick={(e) => this.onSubmit(e)}>Submit</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
				</form>
			</Modal>
		);
	}
}

export default MaBoSSNewParameterForm;
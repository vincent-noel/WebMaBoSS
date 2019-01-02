import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";
import APICalls from "../../../api/apiCalls";
import LoadingInlineIcon from "../../../commons/loaders/LoadingInlineIcon";
import BufferedTextField from "./MaBoSSFormulaForm";

class MaBoSSNodeForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			nameError: "Please provide a value",

			showErrors: false,
			waitSubmit: false,
		};


		this.inputNameRef = React.createRef();
	}

	onNameChange(name) {
		this.setState({name: name});
		this.checkNodeName(name);
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.state.nameError !== "") {
			this.setState({showErrors: true});

			if (this.state.nameError !== "") {
				this.inputNameRef.current.focus();
			}

		} else {
			this.setState({showErrors: false});
			this.props.submit(
				this.state.name,
			);
		}

	}

	checkNodeName(name) {

		if (name === "") {
			this.setState({nameError: "Please provide a name"});
		} else {
			this.setState({nameError: ""});
		}
	}


	componentDidMount() {
		this.checkNodeName(this.state.name);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.status !== this.props.status) {
			this.setState({nameError: "", showErrors: false});
		}

		if (nextProps.name !== this.props.name && nextProps.name !== this.state.name) {
			this.setState({name: nextProps.name})
		}

		return true;
	}

	render() {

		const errors = [];

		if (this.state.nameError !== "") {
			errors.push(this.state.nameError);
		}

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form>
				<Card>
					<CardHeader>Create new node</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={errors}/> : null}
						<div className="form-group">
							<label htmlFor="value">Name</label>
							<BufferedTextField
								id="name" name="name" inputRef={this.inputNameRef}
								value={this.state.name}
								error={this.state.nameError} disabled={this.props.field !== null}
								onValueChange={(e) => this.onNameChange(e.target.value)}

							/>
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

export default MaBoSSNodeForm;
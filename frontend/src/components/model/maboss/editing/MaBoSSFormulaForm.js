import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";
import APICalls from "../../../api/apiCalls";

class MaBoSSFormulaForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			formula: "",

			nameError: "",
			formulaError: "",

			showErrors: false,
			waitSubmit: false,
		};

		this.checkFormulaCall = null;

		this.inputNameRef = React.createRef();
		this.inputFormulaRef = React.createRef();
	}


	onNameChange(name) {
		this.setState({name: name, showErrors: false});
		this.checkName(name);
	}

	onFormulaChange(formula) {
		this.setState({formula: formula, showErrors: false});
		this.checkFormula(formula);
	}

	checkName(name) {
		if (this.checkFormulaCall !== null) { this.checkFormulaCall.cancel(); }

		if (this.props.node !== null){
			this.setState({waitSubmit: true});
			this.checkFormulaCall = APICalls.MaBoSSCalls.checkFormula(
				this.props.project, this.props.modelId, this.props.node, name, "1"
			);
			this.checkFormulaCall.promise.then((data) => {
				this.setState({nameError: data.error, waitSubmit: false});
			});
		}
	}

	checkFormula(formula) {
		if (this.checkFormulaCall !== null) { this.checkFormulaCall.cancel(); }

		if (this.props.node !== null){
			this.setState({waitSubmit: true});
			this.checkFormulaCall = APICalls.MaBoSSCalls.checkFormula(
				this.props.project, this.props.modelId, this.props.node,
				this.props.field !== null ? this.props.field : "test_whatever_just_shouldnt_exists",
				formula
			);
			this.checkFormulaCall.promise.then((data) => {
				this.setState({formulaError: data.error, waitSubmit: false});
			});
		}
	}


	onSubmit(e) {
		e.preventDefault();

		if (this.state.nameError !== "") {
			this.inputNameRef.current.focus();
		}

		if (this.state.formulaError !== "") {
			this.inputFormulaRef.current.focus();
		}

		if (this.state.nameError !== "" || this.state.formulaError !== "") {
			this.setState({showErrors: true});
		} else {
			this.setState({showErrors: false});
			this.props.submit(this.props.node,
				this.props.field !== null ? this.props.field : this.state.name,
				this.state.formula
			);

		}

	}

	componentDidMount() {
		this.checkFormula(this.state.formula);
		this.checkName(this.state.name);
	}

	componentWillUnmount() {
		if (this.checkFormulaCall !== null) {
			this.checkFormulaCall.cancel();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.status !== this.props.status) {
			this.setState({name: "", nameError: "", formulaError: "", showErrors: false});
		}

		if (nextProps.formula !== this.props.formula && nextProps.formula !== this.state.formula) {
			this.setState({formula: nextProps.formula})
		}

		return true;
	}

	render() {

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form>
				<Card>
					<CardHeader>{this.props.field !== null ? "Editing" : "Creating"} formula</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={ this.state.error !== "" ? [this.state.error] : []}/> : null}
						<div className="form-group">
							<label htmlFor="name">Name</label>
							<input
								id="name" name="name" ref={this.inputNameRef}
								type="text" value={this.props.field !== null ? this.props.field : this.state.name}
								className={"form-control" + (this.state.nameError !== "" ?" is-invalid":"")}
								onChange={(e) => this.onNameChange(e.target.value)}
								disabled={this.props.field !== null}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="formula">Formula</label>
							<input
								id="formula" name="formula" ref={this.inputFormulaRef}
								type="text" value={this.state.formula}
								className={"form-control" + (this.state.formulaError !== "" ?" is-invalid":"")}
								onChange={(e) => this.onFormulaChange(e.target.value)}
							/>
						</div>
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="mr-auto" onClick={() => this.props.toggle()}>Close</Button>
							<Button type="submit" color="default" className="ml-auto" onClick={(e) => this.onSubmit(e)} disabled={this.state.waitSubmit}>Submit</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
				</form>
			</Modal>
		);
	}
}

export default MaBoSSFormulaForm;
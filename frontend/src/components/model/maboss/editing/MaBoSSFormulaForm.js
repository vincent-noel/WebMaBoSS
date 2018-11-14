import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";

class MaBoSSFormulaForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			formula: "",

			error: "",
			showErrors: false,
		};

		this.inputFormulaRef = React.createRef();
	}


	onChange(formula) {
		this.setState({formula: formula});
		this.props.check(this.props.node, this.props.field, formula);
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.props.error !== "") {
			this.setState({showErrors: true, error: this.props.error});
			this.inputFormulaRef.current.focus();
		} else {
			this.setState({showErrors: false, error: this.props.error});
			this.props.submit(this.props.node, this.props.field, this.state.formula);
		}

	}

	componentDidMount() {
		this.setState({formula: this.props.formula});
		this.props.check(this.props.node, this.props.field, this.props.formula);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.status !== this.props.status) {
			this.setState({error: "", showErrors: false, formula: nextProps.formula});
		}

		if (nextProps.formula !== this.props.formula) {
			this.setState({formula: nextProps.formula});
			this.props.check(nextProps.node, nextProps.field, nextProps.formula);
		}

		return true;
	}

	render() {
		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form>
				<Card>
					<CardHeader>Editing formula</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={ this.state.error !== "" ? [this.state.error] : []}/> : null}
						<input
							id="formula" name="formula" ref={this.inputFormulaRef}
							type="text" value={this.state.formula}
							className={"form-control" + (this.props.error !== "" ?" is-invalid":"")}
							onChange={(e) => this.onChange(e.target.value)}/>
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

export default MaBoSSFormulaForm;
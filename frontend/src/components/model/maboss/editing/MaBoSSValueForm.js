import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";

class MaBoSSValueForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			value: "",

			error: "",
			showErrors: false,
		};

		this.inputValueRef = React.createRef();
	}


	onChange(value) {
		this.setState({value: value});
		this.props.check(this.props.name, value);
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.props.error !== "") {
			this.setState({showErrors: true, error: this.props.error});
			this.inputValueRef.current.focus();
		} else {
			this.setState({showErrors: false, error: this.props.error});
			this.props.submit(this.props.name, this.state.value);
		}

	}

	componentDidMount() {
		this.setState({value: this.props.value});
		this.props.check(this.props.name, this.props.value);
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.status !== this.props.status) {
			this.setState({error: "", showErrors: false, value: nextProps.value});
		}

		if (nextProps.value !== this.props.value) {
			this.setState({value: nextProps.value});
			this.props.check(nextProps.name, nextProps.value);
		}

		return true;
	}

	render() {
		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form>
				<Card>
					<CardHeader>Editing parameter value</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={ this.state.error !== "" ? [this.state.error] : []}/> : null}
						<input
							id="value" name="value" ref={this.inputValueRef}
							type="text" value={this.state.value}
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

export default MaBoSSValueForm;
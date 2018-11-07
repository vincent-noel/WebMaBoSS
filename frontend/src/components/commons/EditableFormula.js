import React from "react";
import APICalls from "./apiCalls";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons/index";
import ViewButton from "./buttons/ViewButton";
import SimpleEditButton from "./buttons/SimpleEditButton";
import ValidateButton from "./buttons/ValidateButton";
import CancelButton from "./buttons/CancelButton";
import LoadingIcon from "./LoadingIcon";
// import "./editable-formula.scss";


class EditableFormula extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			formula: "",
			initialFormula: "",
			isEditing: false

		};

		this.inputFormulaRef = React.createRef();

		this.toggleEdit = this.toggleEdit.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.onFormulaChanged = this.onFormulaChanged.bind(this);
	}

	toggleEdit() {
		this.setState({isEditing: !this.state.isEditing});
	}

	cancelEdit() {
		this.setState({isEditing: false})
	}

	submitEdit() {
		if (this.props.error === ""){
			this.setState({isEditing: false, initialFormula: this.state.formula});
			this.props.onSubmit(this.state.formula);
		} else {
			this.inputFormulaRef.current.focus();
		}
	}

	onFormulaChanged(formula) {
		this.setState({formula: formula});
		this.props.check(formula);
	}

	shouldComponentUpdate(nextProps) {

		if (nextProps.formula !== this.props.formula && nextProps.formula !== null) {
			this.setState({formula: nextProps.formula, initialFormula: nextProps.formula});
			return false;
		}

		if (nextProps.error !== this.props.error) {
			console.log(nextProps.error);
		}

		return true;
	}


	render() {

		return (
			<tr className="d-flex">
				<td className="d-flex align-items-center">{this.props.name}</td>
				<td className="flex-fill d-flex justify-content-center">
					{
						this.state.isEditing ?
						<input
							id="formula" name="formula" ref={this.inputFormulaRef}
							type="text" value={this.state.formula}
							className={"ml-3 mr-3 form-control" + (this.props.error !== "" ?" is-invalid":"")}
							onChange={(e) => this.onFormulaChanged(e.target.value)}/> :
						this.state.initialFormula
					}
				</td>
				<td className="ml-1">{this.state.isEditing ?
					<React.Fragment>
						<CancelButton onClick={this.cancelEdit} size={"xs"}/>
						<ValidateButton onClick={this.submitEdit} size={"xs"}/>
					</React.Fragment> :
					<SimpleEditButton onClick={this.toggleEdit} size={"xs"}/>
				}</td>
			</tr>

		);
	}
}

export default EditableFormula;
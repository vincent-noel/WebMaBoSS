import React from "react";
import APICalls from "../../../api/apiCalls";
import SimpleEditButton from "../../../commons/buttons/SimpleEditButton";


class MaBoSSNodeFormulas extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			logExp: "",
			// logExpError: "",

			rateUp: "",
			// rateUpError: "",

			rateDown: "",
			// rateDownError: "",
		};

		this.getNodeFormulasCall = null;
		// this.checkFormulaCall = null;

		this.updateFormula = this.updateFormula.bind(this);
		// this.checkFormula = this.checkFormula.bind(this);
	}

	getNodeFormulas(project_id, model_id, node_id) {
		this.getNodeFormulasCall = APICalls.MaBoSSCalls.getMaBoSSNodesFormulas(project_id, model_id, node_id);
		this.getNodeFormulasCall.promise.then(data => this.setState({
			logExp: data.log_exp,
			rateUp: data.rate_up,
			rateDown: data.rate_down
		}));
	}

	updateFormula(field, formula) {
		this.setState({[field]: formula})
	}

	// checkFormula(field, formula) {
	//
	// 	this.checkFormulaCall = APICalls.MaBoSSCalls.checkFormula(this.props.project, this.props.modelId, formula);
	// 	this.checkFormulaCall.promise.then((data) => {
	// 		this.setState({[field + "Error"]: data.error});
	// 	});
	// }

	componentDidMount() {
		this.getNodeFormulas(this.props.project, this.props.modelId, this.props.name)
	}

	componentWillUnmount() {
		if (this.getNodeFormulasCall !== null) {
			this.getNodeFormulasCall.cancel();
		}
	}

	render() {

		return (

			<tbody className={this.props.show ? "collapse.show" : "collapse"}>
			<tr className="d-flex">
				<td className="d-flex align-items-center">logExp</td>
				<td className="flex-fill d-flex justify-content-center">{this.state.logExp}</td>
				<td className="ml-1">
					<SimpleEditButton onClick={() => this.props.edit(this.props.name, "logExp", this.state.logExp)} size={"xs"}/>
				</td>
			</tr>
			<tr className="d-flex">
				<td className="d-flex align-items-center">rateUp</td>
				<td className="flex-fill d-flex justify-content-center">{this.state.rateUp}</td>
				<td className="ml-1">
					<SimpleEditButton onClick={() => this.props.edit(this.props.name, "rateUp", this.state.rateUp)} size={"xs"}/>
				</td>
			</tr>
			<tr className="d-flex">
				<td className="d-flex align-items-center">rateDown</td>
				<td className="flex-fill d-flex justify-content-center">{this.state.rateDown}</td>
				<td className="ml-1">
					<SimpleEditButton onClick={() => this.props.edit(this.props.name, "logExp", this.state.rateDown)} size={"xs"}/>
				</td>
			</tr>
			</tbody>

		);
	}
}

export default MaBoSSNodeFormulas;
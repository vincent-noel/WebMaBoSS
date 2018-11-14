import React from "react";
import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/LoadingIcon";
import UpDownButton from "../../../commons/buttons/UpDownButton";
import MaBoSSFormulaForm from "./MaBoSSFormulaForm";

import "./table-nodes.scss";
import SimpleEditButton from "../../../commons/buttons/SimpleEditButton";

class MaBoSSNodes extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nodes: [],
			nodesFormulas: {},
			showNodesDetails: [],

			showFormulaForm: false,
			nodeFormulaForm: null,
			fieldFormulaForm: null,
			formulaFormulaForm: "",
			errorFormulaForm: "",
		};

		this.getNodesCall = null;
		this.getNodesFormulaCall = null;
		this.checkFormulaCall = null;
		this.saveFormulaCall = null;

		this.toggleFormulaForm = this.toggleFormulaForm.bind(this);
		this.checkFormula = this.checkFormula.bind(this);
		this.editFormula = this.editFormula.bind(this);
		this.saveFormula = this.saveFormula.bind(this);
	}

	editFormula(node, field, formula) {
		this.setState({
			showFormulaForm: true,
			nodeFormulaForm: node,
			fieldFormulaForm: field,
			formulaFormulaForm: formula,
			errorFormulaForm: ""
		})
	}

	checkFormula(node, field, formula) {

		if (node !== null){
			this.checkFormulaCall = APICalls.MaBoSSCalls.checkFormula(
				this.props.project, this.props.modelId, node, field, formula
			);
			this.checkFormulaCall.promise.then((data) => {
				this.setState({errorFormulaForm: data.error});
			});
		}
	}

	saveFormula(node, field, formula) {
		let formulas = this.state.nodesFormulas;
		formulas[node][field] = formula;

		this.saveFormulaCall = APICalls.MaBoSSCalls.saveMaBoSSNodesFormula(
			this.props.project, this.props.modelId, node, field, formula
		);

		this.saveFormulaCall.promise.then(() => {
			this.setState({showFormulaForm: false, nodesFormulas: formulas});
		});
	}

	toggleFormulaForm() {
		this.setState({
			showFormulaForm: !this.state.showFormulaForm
		})
	}

	loadNodes(project_id, model_id) {
		this.getNodesCall = APICalls.MaBoSSCalls.getMaBoSSNodes(project_id, model_id);
		this.getNodesCall.promise.then(data => {
			this.setState({
				nodes: data,
				showNodesDetails: new Array(data.length).fill(false)
			});
			this.loadNodesFormulas(project_id, model_id);
		});

	}

	toggleNodeDetails(index) {
		let array = this.state.showNodesDetails;
		array[index] = !array[index];
		this.setState({showNodesDetails: array});
	}

	loadNodesFormulas(project_id, model_id) {

		this.getNodesFormulaCall = APICalls.MaBoSSCalls.getMaBoSSNodesFormulas(project_id, model_id);
		this.getNodesFormulaCall.promise.then((data) => {
			this.setState({nodesFormulas: data})
		});

	}

	componentDidMount() {
		this.loadNodes(this.props.project, this.props.modelId)
	}

	componentWillUnmount()
	{
		if (this.getNodesCall !== null) {
			this.getNodesCall.cancel();
		}

		if (this.checkFormulaCall !== null) {
			this.checkFormulaCall.cancel();
		}

		if (this.getNodesFormulaCall !== null) {
			this.getNodesFormulaCall.cancel();
		}

		if (this.saveFormulaCall !== null) {
			this.saveFormulaCall.cancel();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.showFormulaForm === false && nextState.showFormulaForm !== this.state.showFormulaForm) {
			console.log("Hiding the form")
		}
		return true;
	}

	render() {

		return (
			<React.Fragment>
			<ul className="list-nodes">
				{
					this.state.nodes.length > 0 ?
					this.state.nodes.map((name, index) => {
						return (
							<li key={index}>
								<table className="table-nodes">
									<thead>
									<tr className={"d-flex"}>
										<th className={"flex-fill name align-items-center"} colSpan="2">{name}</th>
										<th className={"ml-1 actions d-flex align-items-center"}>
											<UpDownButton
												id={index}
												onClick={() => this.toggleNodeDetails(index)}
												status={this.state.showNodesDetails[index]}
												size={"sm"}/>
										</th>
									</tr>
									</thead>

									<tbody className={this.state.showNodesDetails[index] ? "collapse.show" : "collapse"}>
										{
											Object.keys(this.state.nodesFormulas).length > 0 && Object.keys(this.state.nodesFormulas[name]).length > 0 ?
											Object.keys(this.state.nodesFormulas[name]).map((field, f_index) => (
												<tr className="d-flex" key={f_index}>
												<td className="d-flex align-items-center">{field}</td>
												<td className="flex-fill d-flex justify-content-center">
													{
														name in this.state.nodesFormulas ?
															this.state.nodesFormulas[name][field]
														:
															<LoadingIcon width="1rem"/>
													}
												</td>
												<td className="ml-1">
													<SimpleEditButton
														onClick={() => this.editFormula(
															name, field,
															this.state.nodesFormulas[name][field])
														}
														size={"xs"}
													/>
												</td>
											</tr>
											)):<tr><td><LoadingIcon width={"3rem"}/></td></tr>
										}
									</tbody>

								</table>
							</li>
						);
					}) :
					<LoadingIcon width="3rem"/>
				}

			</ul>
			<MaBoSSFormulaForm
				status={this.state.showFormulaForm} toggle={this.toggleFormulaForm}
				node={this.state.nodeFormulaForm} field={this.state.fieldFormulaForm}
				formula={this.state.formulaFormulaForm} check={this.checkFormula}
				error={this.state.errorFormulaForm} submit={this.saveFormula}
			/>
			</React.Fragment>
		);
	}
}

export default MaBoSSNodes;
import React from "react";
import {Button} from "reactstrap";

import APICalls from "../../../api/apiCalls";

import SimpleEditButton from "../../../commons/buttons/SimpleEditButton";
import SimpleAddButton from "../../../commons/buttons/SimpleAddButton";
import SimpleDeleteButton from "../../../commons/buttons/SimpleDeleteButton";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import UpDownButton from "../../../commons/buttons/UpDownButton";
import MaBoSSFormulaForm from "./MaBoSSFormulaForm";

import "./table-nodes.scss";
import MaBoSSNodeForm from "./MaBoSSNodeForm";

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
			formulaFormulaForm: null,

			showNodeForm: false,
			nodeNodeForm: false,

		};

		this.getNodesCall = null;
		this.getNodesFormulaCall = null;
		this.saveFormulaCall = null;
		this.checkDeleteFormulaCall = null;
		this.deleteFormulaCall = null;

		this.toggleFormulaForm = this.toggleFormulaForm.bind(this);
		this.editFormula = this.editFormula.bind(this);
		this.saveFormula = this.saveFormula.bind(this);
		this.createFormula = this.createFormula.bind(this);

		this.toggleNodeForm = this.toggleNodeForm.bind(this);
		this.saveNewNode = this.saveNewNode.bind(this);
	}

	createNode() {
		this.setState({
			showNodeForm: true,
			nodeNodeForm: "",
		});
	}

	toggleNodeForm() {
		this.setState({showNodeForm: !this.state.showNodeForm});
	}

	saveNewNode(name) {
		this.createNodeCall = APICalls.MaBoSSCalls.addMaBoSSNode(this.props.project, this.props.modelId, name);

		this.createNodeCall.promise.then((response) => {
			if (response.status === 200) {
				this.setState({showNodeForm: false});
				this.loadNodes(this.props.project, this.props.modelId);
			}
		});
	}

	deleteNode(name) {
		this.deleteNodeCall = APICalls.MaBoSSCalls.deleteMaBoSSNode(this.props.project, this.props.modelId, name);
		this.deleteNodeCall.promise.then((response) => {
			if (response.error === "") {
				this.loadNodes(this.props.project, this.props.modelId);
			} else {
				this.props.showErrorMessages([response.error]);
			}
		});
	}

	createFormula(node) {
		this.setState({
			showFormulaForm: true,
			nodeFormulaForm: node,
			fieldFormulaForm: null,
			formulaFormulaForm: "",
		});
	}

	editFormula(node, field, formula) {
		this.setState({
			showFormulaForm: true,
			nodeFormulaForm: node,
			fieldFormulaForm: field,
			formulaFormulaForm: formula,
		});
	}

	deleteFormula(node, field) {
		this.checkDeleteFormulaCall = APICalls.MaBoSSCalls.checkDeleteMaBoSSFormula(
			this.props.project, this.props.modelId, node, field
		);

		this.checkDeleteFormulaCall.promise.then((data) => {
			if (data.error === "") {
				this.deleteFormulaCall = APICalls.MaBoSSCalls.deleteMaBoSSFormula(
					this.props.project, this.props.modelId, node, field
				);

				this.deleteFormulaCall.promise.then((response) => {
					if (response.status == 200) {
						const t_formulas = this.state.nodesFormulas;
						delete t_formulas[node][field];
						this.setState({nodesFormulas: t_formulas});
					}
				});
			} else {
				this.props.showErrorMessages([data.error]);
			}
		});
	}

	saveFormula(node, field, formula) {

		this.saveFormulaCall = APICalls.MaBoSSCalls.saveMaBoSSNodesFormula(
			this.props.project, this.props.modelId, node, field, formula
		);

		this.saveFormulaCall.promise.then((response) => {
			if (response.status == 200) {
				let formulas = this.state.nodesFormulas;
				formulas[node][field] = formula;
				this.setState({showFormulaForm: false, nodesFormulas: formulas});
			}
		});
	}

	toggleFormulaForm() {
		this.setState({
			showFormulaForm: !this.state.showFormulaForm
		})
	}

	loadNodes(project_id, model_id) {
		this.getNodesCall = APICalls.MaBoSSCalls.getMaBoSSNodes(project_id, model_id);
		this.getNodesCall.promise.then((data) => {

			this.setState({
				nodes: data,
				showNodesDetails: new Array(data.length).fill(false),
				nodesFormulas: [],
			});

			this.loadNodesFormulas(project_id, model_id);
		});

	}

	loadNodesFormulas(project_id, model_id) {

		this.getNodesFormulaCall = APICalls.MaBoSSCalls.getMaBoSSNodesFormulas(project_id, model_id);
		this.getNodesFormulaCall.promise.then((data) => {
			console.log(data);
			this.setState({nodesFormulas: data});

		});

	}

	toggleNodeDetails(index) {
		let array = this.state.showNodesDetails;
		array[index] = !array[index];
		this.setState({showNodesDetails: array});
	}


	componentDidMount() {
		this.loadNodes(this.props.project, this.props.modelId)
	}

	componentWillUnmount()
	{
		if (this.getNodesCall !== null) {
			this.getNodesCall.cancel();
		}

		if (this.getNodesFormulaCall !== null) {
			this.getNodesFormulaCall.cancel();
		}

		if (this.saveFormulaCall !== null) {
			this.saveFormulaCall.cancel();
		}

		if (this.checkDeleteFormulaCall !== null) {
			this.checkDeleteFormulaCall.cancel();
		}

		if (this.deleteFormulaCall !== null) {
			this.deleteFormulaCall.cancel();
		}
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
											{ this.state.showNodesDetails[index] ? <SimpleAddButton onClick={() => this.createFormula(name)} size="sm"/>: null}
											<UpDownButton
												id={index}
												onClick={() => this.toggleNodeDetails(index)}
												status={this.state.showNodesDetails[index]}
												size={"sm"}/>
											<SimpleDeleteButton onClick={() => this.deleteNode(name) } size={"sm"}/>

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
													<SimpleDeleteButton
														onClick={() => this.deleteFormula(name, field)}
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
				node={this.state.nodeFormulaForm} submit={this.saveFormula}
				field={this.state.fieldFormulaForm} formula={this.state.formulaFormulaForm}
				{... this.props}
			/>
			<Button color="primary" onClick={() => this.createNode()}>New node</Button>
			<MaBoSSNodeForm
					status={this.state.showNodeForm} toggle={this.toggleNodeForm}
					submit={this.saveNewNode} value={this.state.nodeNodeForm}
					{...this.props}
				/>
			</React.Fragment>
		);
	}
}

export default MaBoSSNodes;
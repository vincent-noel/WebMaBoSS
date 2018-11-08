import React from "react";
import APICalls from "../../../api/apiCalls";
import MaBoSSNodeFormulas from "./MaBoSSNodeFormulas";
import LoadingIcon from "../../../commons/LoadingIcon";
import UpDownButton from "../../../commons/buttons/UpDownButton";
import MaBoSSFormulaForm from "./MaBoSSFormulaForm";

import "./table-nodes.scss";

class MaBoSSNodes extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nodes: [],
			showNodesDetails: [],

			showFormulaForm: false,
			nodeFormulaForm: null,
			fieldFormulaForm: null,
			formulaFormulaForm: "",
			errorFormulaForm: "",
		};

		this.getNodesCall = null;
		this.checkFormulaCall = null;

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

		this.checkFormulaCall = APICalls.MaBoSSCalls.checkFormula(this.props.project, this.props.modelId, formula);
		this.checkFormulaCall.promise.then((data) => {
			this.setState({errorFormulaForm: data.error});
		});
	}

	saveFormula(node, field, formula) {
		console.log("Saving formula");
		this.setState({showFormulaForm: false});
	}

	toggleFormulaForm() {
		this.setState({
			showFormulaForm: !this.state.showFormulaForm
		})
	}

	loadNodes(project_id, model_id) {
		this.getNodesCall = APICalls.MaBoSSCalls.getMaBoSSNodes(project_id, model_id);
		this.getNodesCall.promise.then(data => this.setState({
			nodes: data, showNodesDetails: new Array(data.length).fill(false)
		}));

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

		if (this.checkFormulaCall !== null) {
			this.checkFormulaCall.cancel();
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
											<UpDownButton
												id={index}
												onClick={() => this.toggleNodeDetails(index)}
												status={this.state.showNodesDetails[index]}
												size={"sm"}/>
										</th>
									</tr>
									</thead>
									<MaBoSSNodeFormulas
										show={this.state.showNodesDetails[index]} name={name}
										project={this.props.project} modelId={this.props.modelId}
										edit={this.editFormula}
									/>
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
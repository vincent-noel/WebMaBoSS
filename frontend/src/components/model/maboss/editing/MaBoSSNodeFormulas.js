import React from "react";
import APICalls from "../../../commons/apiCalls";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons/index";
import ViewButton from "../../../commons/buttons/ViewButton";
import "./table-nodes.scss";
import EditableFormula from "../../../commons/EditableFormula";


class MaBoSSNodeFormulas extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			logExp: null,
			logExpError: "",

			rateUp: null,
			rateUpError: "",

			rateDown: null,
			rateDownError: "",
		};

		this.getNodeFormulasCall = null;
		this.checkFormulaCall = null;

		this.updateFormula = this.updateFormula.bind(this);
		this.checkFormula = this.checkFormula.bind(this);
	}

	getNodeFormulas(project_id, model_id, node_id) {
		this.getNodeFormulasCall = APICalls.getNodesFormulas(project_id, model_id, node_id);
		this.getNodeFormulasCall.promise.then(data => this.setState({
			logExp: data.log_exp,
			rateUp: data.rate_up,
			rateDown: data.rate_down
		}));
	}

	updateFormula(field, formula) {
		this.setState({[field]: formula})
	}

	checkFormula(field, formula) {

		this.checkFormulaCall = APICalls.checkFormula(this.props.project, this.props.modelId, formula);
		this.checkFormulaCall.promise.then((data) => {
			this.setState({[field + "Error"]: data.error});
		});
	}

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
				<EditableFormula
					name="logExp" formula={this.state.logExp}
					check={(formula) => this.checkFormula("logExp", formula)}
					error={this.state.logExpError}
					onSubmit={(formula) => this.updateFormula("logExp", formula)}/>
				<EditableFormula
					name="rateUp" formula={this.state.rateUp}
					check={(formula) => this.checkFormula("rateUp", formula)}
					error={this.state.rateUpError}
					onSubmit={(formula) => this.updateFormula("rateUp", formula)} />
				<EditableFormula
					name="rateDown" formula={this.state.rateDown}
					check={(formula) => this.checkFormula("rateDown", formula)}
					error={this.state.rateDownError}
					onSubmit={(formula) => this.updateFormula("rateDown", formula)}/>
			</tbody>

		);
	}
}

export default MaBoSSNodeFormulas;
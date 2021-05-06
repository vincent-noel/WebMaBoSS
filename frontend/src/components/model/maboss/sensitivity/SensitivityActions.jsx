import React from "react";
import {Button} from "reactstrap";

class SensitivityActions extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.loadSensitivityAnalyses(this.props.project, this.props.modelId);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.modelId !== this.props.modelId || nextProps.project !== this.props.project) {
			this.props.loadSensitivityAnalyses(nextProps.project, nextProps.modelId);
			return false;
		}
		return true;
	}

	render() {
		return <React.Fragment>
			<Button onClick={() => this.props.createSensitivityAnalysis()}>New sensitivity analysis</Button>
			{
				this.props.listOfSensitivityAnalysis !== null && this.props.listOfSensitivityAnalysis.length > 0
				? 	<Button onClick={() => this.props.showSensitivityAnalysis()} className={"ml-1"}>
						Existing sensitivity analysis
					</Button>
				: null
			}
		</React.Fragment>;
	}
}

export default SensitivityActions;
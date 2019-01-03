import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";


class OldForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			listOfSensitivityAnalysis: null,
			selectedAnalysis: "Please select a simulation",
			selectedAnalysisId: null,
		};

		this.getAnalysesCall = null;
		this.removeAnalysesCall = null;
	}

	loadSensitivityAnalyses (project_id, model_id) {
		if (this.getAnalysesCall !== null) { this.getAnalysesCall.cancel(); }
		this.setState({listOfSensitivityAnalysis: null});
		this.getAnalysesCall = APICalls.MaBoSSCalls.getSensitivityAnalysis(project_id, model_id);

		this.getAnalysesCall.promise.then(response => {
			this.setState({listOfSensitivityAnalysis: response, selectedAnalysis: "Please select a simulation", selectedAnalysisId: null});
		})
	}


	removeOldAnalyses(project_id, analysis_id) {
		this.removeAnalysesCall = APICalls.MaBoSSCalls.deleteSensitivityAnalysis(project_id, analysis_id);
		this.removeAnalysesCall.promise.then(response => this.loadSensitivityAnalyses(this.props.project, this.props.modelId))
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selectedAnalysisId);
	}

	onAnalysisChanged(simulation_id, name) {
		this.setState({
			selectedAnalysis: name,
			selectedAnalysisId: simulation_id
		})
	}

	componentDidMount() {
		this.loadSensitivityAnalyses(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		if (this.getAnalysesCall !== null) this.getAnalysesCall.cancel();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.modelId !== this.props.modelId) {
			this.loadSensitivityAnalyses(nextProps.project, nextProps.modelId);
			return false;
		}

		if (nextProps.status && nextProps.status !== this.props.status) {
			this.loadSensitivityAnalyses(nextProps.project, nextProps.modelId);
		}

		return true;
	}

	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Load existing sensitivity analysis</CardHeader>
						<CardBody>
                            {
                            	this.state.listOfSensitivityAnalysis != null ?
									<div className="dropdown container-fluid">
										<button className="btn btn-secondary dropdown-toggle" type="button"
												id="dropdownMenuButton"
												data-toggle="dropdown"
												aria-haspopup="true" aria-expanded="false" style={{width: '100%'}}>
											{this.state.selectedAnalysis}
										</button>
										<div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
											 style={{width: '100%'}}>
											{this.state.listOfSensitivityAnalysis.map((analysis, id) => {
												return <a
													className="dropdown-item" key={analysis.id}
													onClick={(e) => this.onAnalysisChanged(analysis.id, analysis.name)}
												>{analysis.name}</a>

											})}
										</div>
									</div>
                                :
                                	<LoadingIcon width="3rem"/>
                            }
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {this.props.toggle();}}>Close</Button>
								<Button color="danger" className="ml-auto mr-auto" onClick={() => {this.removeOldAnalyses(this.props.project, this.state.selectedAnalysisId);}}>Remove</Button>
								<Button type="submit" color="default" className="ml-auto">Submit</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default OldForm;
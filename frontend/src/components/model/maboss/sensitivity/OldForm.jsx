import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../../../api/apiCalls";
import MyDropdown from "../../../commons/buttons/MyDropdown";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";


class OldForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedAnalysis: "Please select a simulation",
			selectedAnalysisId: null,
		};

		this.removeAnalysesCall = null;
	}

	removeOldAnalyses(project_id, analysis_id) {
		this.removeAnalysesCall = APICalls.MaBoSSCalls.deleteSensitivityAnalysis(project_id, analysis_id);
		this.removeAnalysesCall.promise.then(response => this.loadSensitivityAnalyses(this.props.project, this.props.modelId))
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.props.project, this.state.selectedAnalysisId);
	}

	onAnalysisChanged(simulation_ind) {
		this.setState({
			selectedAnalysis: this.props.listOfSensitivityAnalysis[simulation_ind].name,
			selectedAnalysisId: this.props.listOfSensitivityAnalysis[simulation_ind].id
		})
	}

	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Load existing sensitivity analysis</CardHeader>
						<CardBody>
                            {
								this.props.listOfSensitivityAnalysis !== null && this.props.listOfSensitivityAnalysis.length > 0 ?
									<MyDropdown 
									label={this.state.selectedAnalysis}
									width={"100%"}
									dict={this.props.listOfSensitivityAnalysis.reduce((result, element, ind)=>{
										result[ind] = element.name;
										return result;
									}, {})}
									callback={(id)=>{this.onAnalysisChanged(id)}}
								/>
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
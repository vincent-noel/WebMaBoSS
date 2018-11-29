import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";


class OldSimForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			listOfSimulations: [],
			selectedSimulation: "Please select a simulation",
			selectedSimulationId: null,
		};

		this.getListSimulationCall = null;
		this.removeSimulationCall = null;
	}

	loadListSimulations(project_id, model_id) {

		if (this.getListSimulationCall !== null) {
			this.getListSimulationCall.cancel();
        }

		this.setState({
			listOfSimulations: [],
			selectedSimulation: "Please select a simulation",
			selectedSimulationId: null
		});

		this.getListSimulationCall = APICalls.MaBoSSCalls.getListOfMaBoSSSimulations(project_id, model_id);
		this.getListSimulationCall.promise.then(data => {
			this.setState({listOfSimulations: data});
			this.props.showOldSimButton(data.length > 0);
		});
	}

	removeOldSim(project_id, simulation_id) {

		this.removeSimulationCall = APICalls.MaBoSSCalls.deleteMaBossSimulation(project_id, simulation_id);
		this.removeSimulationCall.promise.then(response => this.loadListSimulations(this.props.project, this.props.modelId))
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selectedSimulationId);
	}

	onSimulationChanged(simulation_id, name) {
		this.setState({
			selectedSimulation: name,
			selectedSimulationId: simulation_id
		})
	}

	componentDidMount() {
		this.loadListSimulations(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		if (this.getListSimulationCall !== null) this.getListSimulationCall.cancel();
		if (this.removeSimulationCall !== null) this.removeSimulationCall.cancel();
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.modelId !== this.props.modelId) {
			this.loadListSimulations(nextProps.project, nextProps.modelId);
			return false;
		}

		if (nextProps.status && nextProps.status !== this.props.status) {
			this.loadListSimulations(nextProps.project, nextProps.modelId);
		}

		return true;
	}

	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Load existing simulation</CardHeader>
						<CardBody>
                            {
                            	this.state.listOfSimulations.length > 0 ?
									<div className="dropdown container-fluid">
										<button className="btn btn-secondary dropdown-toggle" type="button"
												id="dropdownMenuButton"
												data-toggle="dropdown"
												aria-haspopup="true" aria-expanded="false" style={{width: '100%'}}>
											{this.state.selectedSimulation}
										</button>
										<div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
											 style={{width: '100%'}}>
											{this.state.listOfSimulations.map((simulation, id) => {
												return <a
													className="dropdown-item" key={simulation.id}
													onClick={(e) => this.onSimulationChanged(simulation.id, simulation.name)}
												>{simulation.name}</a>

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
								<Button color="danger" className="ml-auto mr-auto" onClick={() => {this.removeOldSim(this.props.project, this.state.selectedSimulationId);}}>Remove</Button>
								<Button type="submit" color="default" className="ml-auto">Submit</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default OldSimForm;
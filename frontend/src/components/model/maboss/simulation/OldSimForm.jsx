import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";


class OldSimForm extends React.Component {

	static defaultState = {
			selectedSimulation: "Please select a simulation",
			selectedSimulationId: null,
		};

	constructor(props) {
		super(props);
		this.state = OldSimForm.defaultState;
	}

	removeOldSim() {

		this.setState(OldSimForm.defaultState);
		this.props.removeOldSim(this.props.project, this.props.modelId, this.state.selectedSimulationId);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selectedSimulationId, this.state.selectedSimulation);
	}

	onSimulationChanged(simulation_id, name) {
		this.setState({
			selectedSimulation: name,
			selectedSimulationId: simulation_id
		})
	}

	componentDidMount() {
		this.props.loadListSimulations(this.props.project, this.props.modelId);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.modelId !== this.props.modelId) {
			this.props.loadListSimulations(nextProps.project, nextProps.modelId);
			return false;
		}

		if (nextProps.status && nextProps.status !== this.props.status) {
			this.props.loadListSimulations(nextProps.project, nextProps.modelId);
		}

		return true;
	}

	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status && this.props.listOfSimulations !== null} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Load existing simulation</CardHeader>
						<CardBody>
                            {
                            	this.props.listOfSimulations != null ?
									<div className="dropdown container-fluid">
										<button className="btn btn-secondary dropdown-toggle" type="button"
												id="dropdownMenuButton"
												data-toggle="dropdown"
												aria-haspopup="true" aria-expanded="false" style={{width: '100%'}}>
											{this.state.selectedSimulation}
										</button>
										<div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
											 style={{width: '100%'}}>
											{this.props.listOfSimulations.map((simulation, id) => {
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
								<Button color="danger" className="ml-auto mr-auto" onClick={() => {this.removeOldSim()}}>Remove</Button>
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
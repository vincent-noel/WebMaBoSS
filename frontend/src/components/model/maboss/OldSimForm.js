import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";


class OldSimForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedSimulation: "Please select a simulation",
			selectedSimulationId: null,
		};

	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selectedSimulationId);
	}

	onSimulationChanged(simulation) {
		this.setState({
			selectedSimulation: "Simulation " + simulation,
			selectedSimulationId: simulation
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.listOfSimulations !== this.props.listOfSimulations) {
			this.setState({
				selectedSimulation: "Please select a simulation",
				selectedSimulationId: null
			})
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
							<div className="dropdown container-fluid">
								<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
										data-toggle="dropdown"
										aria-haspopup="true" aria-expanded="false" style={{width: '100%'}}>
									{this.state.selectedSimulation}
								</button>
								<div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{width: '100%'}}>
									{this.props.listOfSimulations.map((simulation, id) => {
										return <a
											className="dropdown-item" key={simulation.id}
											onClick={(e) => this.onSimulationChanged(simulation.id)}
										>Simulation {simulation.id}
										</a>

									})}
								</div>
							</div>
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {this.props.toggle();}}>Close</Button>
								<Button color="danger" className="ml-auto mr-auto" onClick={() => {this.props.remove(this.state.selectedSimulationId);}}>Remove</Button>
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
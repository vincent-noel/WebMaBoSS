import React from "react";
import {NavLink} from "react-router-dom";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import getCSRFToken from "../../commons/getCSRFToken";
import {getAPIKey, getModel, getProject} from "../../commons/sessionVariables";

class OldSimForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedSimulation: "Please select a simulation",
			selectedSimulationId: null,
			listSimulations: []
		};

	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selectedSimulationId);
	}

	loadListSimulations() {
		const conf = {
		  method: "get",
		  headers: new Headers({
			'Authorization': "Token " + getAPIKey(),
			'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/logical_model/" + getProject() + "/" + getModel() + "/maboss", conf)
		.then(response => {	return response.json(); })
		.then(data => {
			this.setState({listSimulations: data});
		});

	}

	onSimulationChanged(simulation) {
		this.setState({
			selectedSimulation: "Simulation " + simulation,
			selectedSimulationId: simulation
		})
	}

	componentDidMount() {
		this.loadListSimulations();
	}


	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.status !== this.props.status) {
			this.loadListSimulations();
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
									{this.state.listSimulations.map((simulation, id) => {
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
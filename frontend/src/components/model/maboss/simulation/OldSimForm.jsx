import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import MyDropdown from "../../../commons/buttons/MyDropdown";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";


class OldSimForm extends React.Component {

	static defaultState = {
			selectedSimulation: "Please select a simulation",
			selectedSimulationId: null,
		};

	constructor(props) {
		super(props);
		this.state = OldSimForm.defaultState;
		
		this.onSimulationChanged = this.onSimulationChanged.bind(this);
		this.removeOldSim = this.removeOldSim.bind(this);
	}

	removeOldSim() {

		this.setState(OldSimForm.defaultState);
		this.props.removeOldSim(this.props.project, this.props.modelId, this.state.selectedSimulationId);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selectedSimulationId, this.state.selectedSimulation);
	}

	onSimulationChanged(simulation_id) {
		this.setState({
			selectedSimulation: this.props.listOfSimulations[simulation_id].name,
			selectedSimulationId: this.props.listOfSimulations[simulation_id].id
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
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Load existing simulation</CardHeader>
						<CardBody>
                            {
                            	this.props.listOfSimulations != null ?
									
									<MyDropdown
										dict={this.props.listOfSimulations.reduce((result, simulation, ind)=>{
											result[ind] = simulation.name;
											return result;
										}, {})}
										label={this.state.selectedSimulation}
										width="25rem"
										callback={(id)=>this.onSimulationChanged(id)}
									/>
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
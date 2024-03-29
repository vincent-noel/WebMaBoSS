import React from "react";
import NewSimForm from "./NewSimForm";
import OldSimForm from "./OldSimForm";
import {Button, ButtonToolbar} from "reactstrap";
import { isConnected } from "../../../commons/sessionVariables";


class MaBossActions extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showNewSimForm: false,
			showOldSimForm: false,

			showOldSimButton: false,
		};

		this.toggleNewSimForm = this.toggleNewSimForm.bind(this);
		this.toggleOldSimForm = this.toggleOldSimForm.bind(this);

		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitOldSim = this.onSubmitOldSim.bind(this);
	}

	toggleNewSimForm() {
		this.setState((state) => ({
			showNewSimForm: !state.showNewSimForm
		}))
	}

	toggleOldSimForm() {
		this.setState((state) => ({
			showOldSimForm: !state.showOldSimForm
		}))
	}

	onSubmit(project_id, model_id, data) {
		this.setState({showNewSimForm: false});
		this.props.onSubmit(project_id, model_id, data);
	}

	onSubmitOldSim(data, name) {
		this.setState({showOldSimForm: false});
		this.props.onSubmitOldSim(data, name);
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.modelId !== this.props.modelId) {
			this.props.updateSim(null);
			return false;
		}

		return true;
	}

	render() {
		return (
			<React.Fragment>
				<ButtonToolbar className="justify-content-start">
					<Button className="mr-1" onClick={() => {this.toggleNewSimForm();}}>New simulation</Button>
					{
						isConnected() && this.props.listOfSimulations !== null && this.props.listOfSimulations.length > 0
						? 	<Button className="mr-1" onClick={() => {this.toggleOldSimForm();}}>
								Load old simulation
							</Button>
						: null
					}
				</ButtonToolbar>
				<br/>
				<NewSimForm
					project={this.props.project}
					modelId={this.props.modelId}
					onSubmit={this.onSubmit}
					status={this.state.showNewSimForm}
					toggle={this.toggleNewSimForm}
				/>
				{ isConnected() ? <OldSimForm
					project={this.props.project}
					modelId={this.props.modelId}
					onSubmit={this.onSubmitOldSim}
					status={this.state.showOldSimForm}
					toggle={this.toggleOldSimForm}
					listOfSimulations={this.props.listOfSimulations}
					loadListSimulations={this.props.loadListSimulations}
					removeOldSim={this.props.removeOldSim}
				/> : null }
			</React.Fragment>
		);
	}
}

export default MaBossActions;
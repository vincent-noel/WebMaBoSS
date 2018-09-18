import React from "react";
import NewSimForm from "./NewSimForm";
import OldSimForm from "./OldSimForm";
import {Button, ButtonToolbar} from "reactstrap";


class MaBossActions extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showNewSimForm: false,
			showOldSimForm: false,
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

	onSubmit(data) {
		this.setState({showNewSimForm: false});
		this.props.onSubmit(data);
	}

	onSubmitOldSim(data) {
		this.setState({showOldSimForm: false});
		this.props.onSubmitOldSim(data);
	}

	render() {

		return (
			<React.Fragment>
				<ButtonToolbar className="justify-content-start">
					<Button className="mr-1" onClick={() => {this.toggleNewSimForm();}}>New simulation</Button>
					{
						this.props.listOfSimulations.length > 0
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
				<OldSimForm
					modelId={this.props.modelId}
					onSubmit={this.onSubmitOldSim}
					status={this.state.showOldSimForm}
					toggle={this.toggleOldSimForm}
					remove={this.props.remove}
					listOfSimulations={this.props.listOfSimulations}
				/>
			</React.Fragment>
		);
	}
}

export default MaBossActions;
import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter, Collapse, TabPane} from "reactstrap";
import PropTypes from "prop-types";
import ErrorAlert from "../../../commons/ErrorAlert";

import LoadingInlineIcon from "../../../commons/loaders/LoadingInlineIcon";
import Switch from "../../../commons/buttons/Switch";

import "./table-options.scss"
import APICalls from "../../../api/apiCalls";


class NewForm extends React.Component {

	static propTypes = {
		status: PropTypes.bool.isRequired,
		toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {

			name: "",

			singleMutations: {
				show: false,
				on: false,
				off: false
			},

			doubleMutations: {
				show: false,
				on: false,
				off: false,
			},
			initialStates: false,
			rates: false,

			showErrors: true,
			waitSubmit: false,
		};

		this.toggleSingleMutations = this.toggleSingleMutations.bind(this);
		this.toggleSingleMutationsOn = this.toggleSingleMutationsOn.bind(this);
		this.toggleSingleMutationsOff = this.toggleSingleMutationsOff.bind(this);

		this.toggleDoubleMutations = this.toggleDoubleMutations.bind(this);
		this.toggleInitialStates = this.toggleInitialStates.bind(this);
		this.toggleRates = this.toggleRates.bind(this);

		this.createCall = null;
	}

	handleNameChange(name) {
		this.setState({name: name});
	}

	toggleSingleMutations(state) {
		if (state) {
            this.setState(prevState => ({singleMutations: {...prevState.singleMutations, show: true}}));
        } else {
			this.setState(prevState => ({singleMutations: {...prevState.singleMutations, show: false, on: false, off: false}}));
		}
	}

	toggleSingleMutationsOn(state) {
		this.setState(prevState => ({singleMutations: {...prevState.singleMutations, on: state}}));
	}

	toggleSingleMutationsOff(state) {
		this.setState(prevState => ({singleMutations: {...prevState.singleMutations, off: state}}));
	}

	toggleDoubleMutations(state) {
		if (state) {
            this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, show: true}}));
        } else {
			this.setState(prevState => ({doubleMutations: {...prevState.doubleMutations, show: false, on: false, off: false}}));
		}
	}

	toggleInitialStates(state) {
		this.setState({initialStates: state});
	}

	toggleRates(state) {
		this.setState({rates: state});
	}

	onSubmit(e) {
		e.preventDefault();

		this.createCall = APICalls.MaBoSSCalls.createSensitivityAnalysis(this.props.project, this.props.modelId, {
			name: this.state.name,
			singleMutations: {
				on: this.state.singleMutations.on,
				off: this.state.singleMutations.off,
            },
			doubleMutations: {
				on: this.state.doubleMutations.on,
				off: this.state.doubleMutations.off,
			}
		});

		this.createCall.promise.then(response => {
			this.props.submit(response['analysis_id']);
		});

	}

	render() {

		const errors = [];

		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form onSubmit={(e) => this.onSubmit(e)}>
				<Card>
					<CardHeader>New sensitivity analysis</CardHeader>
					<CardBody>
						{ this.state.showErrors ? <ErrorAlert errorMessages={errors}/> : null}
							<div className="form-group general">
								<label htmlFor="name" className="name">Name</label>
								<input type="text" className="form-control large" id="name" placeholder="Name of the simulation"
									   value={this.state.name}
									   onChange={(e) => this.handleNameChange(e.target.value)}
								/>
							</div>

						<ul className="list-options">
							<li className="option">
								<span className="name">Single mutations</span>
								<span className="value">
									<Switch
										checked={this.state.singleMutations.show}
										updateCallback={this.toggleSingleMutations}
										id={"single_mutations"}
									/>
								</span>
							</li>
							<Collapse isOpen={this.state.singleMutations.show}>
								<li className="sub-option">
									<span className="name">OFF mutations</span>
									<span className="value">
										<Switch
											checked={this.state.singleMutations.on}
											updateCallback={this.toggleSingleMutationsOn}
											id={"single_mutations_on"}
										/>
									</span>
								</li>
								<li className="sub-option">
									<span className="name">ON mutations</span>
									<span className="value">
										<Switch
											checked={this.state.singleMutations.off}
											updateCallback={this.toggleSingleMutationsOff}
											id={"single_mutations_off"}
										/>
									</span>
								</li>
							</Collapse>
							<li className="option">
								<span className="name">Double mutations</span>
								<span className="value">
									<Switch
										checked={this.state.doubleMutations.show}
										updateCallback={this.toggleDoubleMutations}
										id={"double_mutations"}
									/>
								</span>
							</li>
						</ul>
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="mr-auto" onClick={() => this.props.toggle()}>Close</Button>
							<Button
								type="submit" color="default" className="ml-auto"
								disabled={this.state.waitSubmit}
							>Submit {this.state.waitSubmit ? <LoadingInlineIcon width="1rem"/> : null}</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
				</form>
			</Modal>
		);
	}
}

export default NewForm;
import React from "react";
import {Modal, Card, CardHeader, CardBody, CardFooter, Button, ButtonToolbar, Dropdown, DropdownToggle, DropdownItem, DropdownMenu} from "reactstrap";
import PropTypes from "prop-types";
import "./table-options.scss"
import LoadingIcon from "../../../commons/loaders/LoadingIcon";

class FiltersForm extends React.Component {

	static propTypes = {
		   status: PropTypes.bool.isRequired,
		   toggle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			statesDropdownOpen: false,
			selectedState: null,
			selectedStateLabel: "Select a state to filter",

			operatorDropdownOpen: false,
			selectedOperator: 0,
			selectedOperatorLabel: "Inferior",

			threshold: 0,
		};

		this.toggleStateDropdown = this.toggleStateDropdown.bind(this);
		this.toggleOperatorDropdown = this.toggleOperatorDropdown.bind(this);

	}

	toggleStateDropdown() {
		this.setState({statesDropdownOpen: !this.state.statesDropdownOpen})
	}

	selectState(state, id) {
		this.setState({selectedState: id, selectedStateLabel: state});
	}

	toggleOperatorDropdown() {
		this.setState({operatorDropdownOpen: !this.state.operatorDropdownOpen})
	}

	selectOperator(label, id) {
		this.setState({selectedOperator: id, selectedOperatorLabel: label});
	}

	setThreshold(threshold) {
		this.setState({threshold: threshold});
	}

	onClearFilters() {
		this.props.toggle();
		this.props.clearFilters();
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.toggle();
		this.props.filterStates(
			this.state.selectedState, this.state.selectedOperator, parseFloat(this.state.threshold)
		);
	}

	render() {
		return (
			<Modal isOpen={this.props.status} toggle={() => this.props.toggle()}>
				<form onSubmit={(e) => this.onSubmit(e)}>
				<Card>
					<CardHeader>Filter simulations</CardHeader>
					<CardBody>
						{
							this.props.listStates != null ?
								<Dropdown isOpen={this.state.statesDropdownOpen} toggle={this.toggleStateDropdown} className="container-fluid">
									<DropdownToggle style={{width: '100%'}} caret>{this.state.selectedStateLabel}</DropdownToggle>
									<DropdownMenu style={{width: '100%'}}>
									{
										this.props.listStates.length > 0 ?
											this.props.listStates.map((state, id) => {
												return <DropdownItem key={id}
													onClick={() => this.selectState(state, id)}
												>{state}</DropdownItem>
										}) : null
									}
									</DropdownMenu>
								  </Dropdown>
								:
								<LoadingIcon width="3rem"/>
						}

						<Dropdown isOpen={this.state.operatorDropdownOpen} toggle={this.toggleOperatorDropdown} className="container-fluid">
							<DropdownToggle style={{width: '100%'}} caret>{this.state.selectedOperatorLabel}</DropdownToggle>
							<DropdownMenu style={{width: '100%'}}>
								<DropdownItem onClick={() => this.selectOperator("Inferior",0)}>Inferior</DropdownItem>
								<DropdownItem onClick={() => this.selectOperator("Superior",1)}>Superior</DropdownItem>
							</DropdownMenu>
					  	</Dropdown>

						<div className="form-group container-fluid">
							<input type="text" className="form-control large" id="name" placeholder="Threshold"
								onChange={(e) => this.setThreshold(e.target.value)} value={this.state.threshold}
							/>
						</div>
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="mr-auto" onClick={() => this.props.toggle()}>Close</Button>
							<Button color="danger" className="mr-auto ml-auto" onClick={() => this.onClearFilters()}>Clear filters</Button>
							<Button type="submit" color="default" className="ml-auto">Submit</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
				</form>
			</Modal>
		);
	}
}

export default FiltersForm;
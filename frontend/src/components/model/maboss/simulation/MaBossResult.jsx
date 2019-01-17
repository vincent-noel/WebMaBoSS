import React from "react";
import {TabContent, TabPane, Nav, NavItem, NavLink, ButtonToolbar, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";

import MaBossFixedPoints from "./MaBossFixedPoints";
import MaBossNodesProbTraj from "./MaBossNodesProbTraj";
import MaBossStatesProbTraj from "./MaBossStatesProbTraj";

import classnames from 'classnames';
import APICalls from "../../../api/apiCalls";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";


class MaBossResult extends React.Component {

	static colormap = ['#4c72b0', '#55a868', '#c44e52', '#8172b2', '#ccb974', '#64b5cd', '#4c72b0', '#55a868', '#c44e52', '#8172b2'];

	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: 'fp',
			dropdownOpen: false
		};

		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.createNewModel = this.createNewModel.bind(this);

		this.createNewModelCall = null;
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab});
		}
	}

	toggleDropdown() {
		this.setState({dropdownOpen: !this.state.dropdownOpen});
	}

	createNewModel() {
		this.createNewModelCall = APICalls.MaBoSSCalls.createNewModelFromSimulation(this.props.project, this.props.simulationId);
		this.createNewModelCall.promise.then(response => {
			this.props.getModels(this.props.project);
		});
	}

	componentWillUnmount() {

		if (this.createNewModelCall !== null) {
			this.createNewModelCall.cancel();
		}

	}


	render() {

		if (this.props.simulationId !== null) {
			return (
				<React.Fragment>

					<Nav tabs style={{"justifyContent": "space-between"}}>
						<div className={"d-flex"} style={{"justifyContent": "flex-start"}}>
							<NavItem>
								<NavLink
									onClick={() => this.toggle('fp')}
									className={classnames({ active: this.state.activeTab === 'fp' })}
								>Steady states distribution</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									onClick={() => this.toggle('npt')}
									className={classnames({ active: this.state.activeTab === 'npt' })}
								>Nodes probability trajectories</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									onClick={() => this.toggle('spt')}
									className={classnames({ active: this.state.activeTab === 'spt' })}
								>States probability trajectories</NavLink>
							</NavItem>
						</div>
						<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
							<DropdownToggle><FontAwesomeIcon icon={faCaretDown}/></DropdownToggle>
							<DropdownMenu right>
								<DropdownItem onClick={() => {this.createNewModel();}}>Save as new model</DropdownItem>
								<DropdownItem onClick={() => {APICalls.MaBoSSCalls.downloadMaBoSSModel(this.props.project, this.props.simulationId, "bnd_file")}}>Download BND file</DropdownItem>
								<DropdownItem onClick={() => {APICalls.MaBoSSCalls.downloadMaBoSSModel(this.props.project, this.props.simulationId, "cfg_file")}}>Download CFG file</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<TabPane tabId="fp">
							<MaBossFixedPoints
								project={this.props.project}
								modelId={this.props.modelId}
								simulationId={this.props.simulationId}
								simulationName={this.props.simulationName}
								colormap={MaBossResult.colormap}
							/>
						</TabPane>
						<TabPane tabId="npt">
							<MaBossNodesProbTraj
								project={this.props.project}
								modelId={this.props.modelId}
								simulationId={this.props.simulationId}
								simulationName={this.props.simulationName}
								colormap={MaBossResult.colormap}
							/>
						</TabPane>
						<TabPane tabId="spt">
							<MaBossStatesProbTraj
								project={this.props.project}
								modelId={this.props.modelId}
								simulationId={this.props.simulationId}
								simulationName={this.props.simulationName}
								colormap={MaBossResult.colormap}
							/>
						</TabPane>
					</TabContent>
				</React.Fragment>
			);
		} else return null;

	}
}

export default MaBossResult;
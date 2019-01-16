import React from "react";
import {TabContent, TabPane, Nav, NavItem, NavLink, ButtonToolbar, Button} from "reactstrap";

import MaBossFixedPoints from "./MaBossFixedPoints";
import MaBossNodesProbTraj from "./MaBossNodesProbTraj";
import MaBossStatesProbTraj from "./MaBossStatesProbTraj";

import classnames from 'classnames';
import APICalls from "../../../api/apiCalls";


class MaBossResult extends React.Component {

	static colormap = ['#4c72b0', '#55a868', '#c44e52', '#8172b2', '#ccb974', '#64b5cd', '#4c72b0', '#55a868', '#c44e52', '#8172b2'];

	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: 'fp'
		}
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab});
		}
	}

	render() {

		if (this.props.simulationId !== null) {
			return (
				<React.Fragment>

					<Nav tabs>
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
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<TabPane tabId="fp">
							<MaBossFixedPoints
								project={this.props.project}
								modelId={this.props.modelId}
								simulationId={this.props.simulationId}
								colormap={MaBossResult.colormap}
							/>
						</TabPane>
						<TabPane tabId="npt">
							<MaBossNodesProbTraj
								project={this.props.project}
								modelId={this.props.modelId}
								simulationId={this.props.simulationId}
								colormap={MaBossResult.colormap}
							/>
						</TabPane>
						<TabPane tabId="spt">
							<MaBossStatesProbTraj
								project={this.props.project}
								modelId={this.props.modelId}
								simulationId={this.props.simulationId}
								colormap={MaBossResult.colormap}
							/>
						</TabPane>
					</TabContent>
					<ButtonToolbar>
						<Button className={"mr-1"} onClick={() => {APICalls.MaBoSSCalls.downloadMaBoSSModel(this.props.project, this.props.simulationId, "bnd_file")}}>Download BND File</Button>
						<Button className={"mr-1"} onClick={() => {APICalls.MaBoSSCalls.downloadMaBoSSModel(this.props.project, this.props.simulationId, "cfg_file")}}>Download CFG File</Button>

					</ButtonToolbar>
				</React.Fragment>
			);
		} else return null;

	}
}

export default MaBossResult;
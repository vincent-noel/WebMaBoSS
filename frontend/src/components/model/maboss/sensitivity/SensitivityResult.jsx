import React from "react";
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";


import classnames from 'classnames';
import SensitivitySteadyStates from "./SensitivitySteadyStates";
import Settings from "../../../Settings";


class SensitivityResult extends React.Component {

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

		if (this.props.analysisId !== null) {
			return (
				<React.Fragment>

					<Nav tabs>
						<NavItem>
							<NavLink
								onClick={() => this.toggle('fp')}
							  	className={classnames({ active: this.state.activeTab === 'fp' })}
							>Steady states distribution</NavLink>
						</NavItem>
						{/*<NavItem>*/}
							{/*<NavLink*/}
								{/*onClick={() => this.toggle('npt')}*/}
								{/*className={classnames({ active: this.state.activeTab === 'npt' })}*/}
							{/*>Nodes probability trajectories</NavLink>*/}
						{/*</NavItem>*/}
						{/*<NavItem>*/}
							{/*<NavLink*/}
								{/*onClick={() => this.toggle('spt')}*/}
								{/*className={classnames({ active: this.state.activeTab === 'spt' })}*/}
							{/*>States probability trajectories</NavLink>*/}
						{/*</NavItem>*/}
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<TabPane tabId="fp">
							<SensitivitySteadyStates
								project={this.props.project}
								analysisId={this.props.analysisId}
								analysisStatus={this.props.analysisStatus}
								colormap={Settings.colormap}
								steadyStates={this.props.steadyStates}
								getSteadyStates={this.props.getSteadyStates}
							/>
						</TabPane>
						{/*<TabPane tabId="npt">*/}
							{/*<MaBossNodesProbTraj*/}
								{/*project={this.props.project}*/}
								{/*modelId={this.props.modelId}*/}
								{/*simulationId={this.props.simulationId}*/}
								{/*colormap={Settings.colormap}*/}
							{/*/>*/}
						{/*</TabPane>*/}
						{/*<TabPane tabId="spt">*/}
							{/*<MaBossStatesProbTraj*/}
								{/*project={this.props.project}*/}
								{/*modelId={this.props.modelId}*/}
								{/*simulationId={this.props.simulationId}*/}
								{/*colormap={Settings.colormap}*/}
							{/*/>*/}
						{/*</TabPane>*/}
					</TabContent>
				</React.Fragment>
			);
		} else return null;

	}
}

export default SensitivityResult;
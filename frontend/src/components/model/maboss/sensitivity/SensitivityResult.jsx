import React from "react";
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";


import classnames from 'classnames';
import SensitivitySteadyStates from "./SensitivitySteadyStates";
import Settings from "../../../Settings";
import APICalls from "../../../api/apiCalls";


class SensitivityResult extends React.Component {

	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: 'fp',

			steadyStates : {
				loaded: false,
				table: null
			},

		};

		this.getFixedPointsCall = null;
		this.getStatus = null;
		this.statusChecker = null;
	}

	checkAnalysisStatus(project_id, analysis_id) {
		this.getStatus = APICalls.MaBoSSCalls.getSensitivityAnalysisStatus(project_id, analysis_id);
		this.getStatus.promise.then(data => {
			this.setState({analysisStatus: data.done});
			if (data.done == 1) {
				clearInterval(this.statusChecker);
				this.getFixedPoints(project_id, analysis_id);
			}
		});
	}

	getFixedPoints(project_id, analysis_id) {

		this.setState({steadyStates: {loaded: false, table: null}});
		this.getFixedPointsCall = APICalls.MaBoSSCalls.getSensitivityAnalysisSteadyStates(project_id, analysis_id);
		this.getFixedPointsCall.promise.then(data => {
			this.setState({steadyStates: {loaded: true, table: data.results}})
		});
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab});
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {

		if (nextProps.analysisId !== this.props.analysisId && nextProps.analysisId !== null) {
			this.statusChecker = setInterval(
				() => this.checkAnalysisStatus(nextProps.project, nextProps.analysisId),
				Settings.updateRate
			);
			return false;
		}

		return true;
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
								steadyStates={this.state.steadyStates}
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
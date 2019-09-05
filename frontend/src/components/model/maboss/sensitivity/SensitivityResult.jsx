import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from "reactstrap";
import classnames from 'classnames';
import SensitivitySteadyStates from "./SensitivitySteadyStates";
import Settings from "../../../Settings";
import APICalls from "../../../api/apiCalls";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import FiltersForm from "./FiltersForm";


class SensitivityResult extends React.Component {

	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: 'fp',

			steadyStates : {
				loaded: false,
				table: null,
				filteredTable: null,
			},

			showFiltersForm: false,

			listStates: null,
			colorMap: null,
			analysisStatus: false,
		};

		this.getFixedPointsCall = null;
		this.getStatus = null;
		this.statusChecker = null;
		this.toggleFiltersForm = this.toggleFiltersForm.bind(this);
		this.filterStates = this.filterStates.bind(this);
		this.clearFilters = this.clearFilters.bind(this);
	}

	toggleFiltersForm() {
		this.setState({showFiltersForm: !this.state.showFiltersForm});
	}

	computeStateList(table) {

		let u = {}, res = [], colors = {};

		Object.values(table).map(
			(condition, index) => {
				Object.keys(condition).map(
					(state) => {
						if (!u.hasOwnProperty(state)) {
							res.push(state);
							u[state] = 1;
						}
					}
				);
			}
		);
		res.map((state, index) => {
			colors[state] = Settings.colormap[index % Settings.colormap.length]
		});

		this.setState({listStates: res.sort(), colorMap: colors});
	}


	checkAnalysisStatus(project_id, analysis_id) {
		this.getStatus = APICalls.MaBoSSCalls.getSensitivityAnalysisStatus(project_id, analysis_id);
		this.getStatus.promise.then(data => {
			this.setState({analysisStatus: data.done});

			if (data.done == 1) {
				clearInterval(this.statusChecker);
				this.getFixedPoints(project_id, analysis_id);

			} else {
				if (!this.statusChecker) {
					this.statusChecker = setInterval(
						() => this.checkAnalysisStatus(project_id, analysis_id),
						Settings.updateRate
					);
				}
			}
		});
	}

	getFixedPoints(project_id, analysis_id) {

		this.setState({steadyStates: {loaded: false, table: null}});
		this.getFixedPointsCall = APICalls.MaBoSSCalls.getSensitivityAnalysisSteadyStates(project_id, analysis_id);
		this.getFixedPointsCall.promise.then(data => {
			this.setState({steadyStates: {loaded: true, table: data.results, filteredTable: data.results}});
			this.computeStateList(data.results);
		});
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab});
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {

		if (nextProps.analysisId !== this.props.analysisId && nextProps.analysisId !== null) {
			this.checkAnalysisStatus(nextProps.project, nextProps.analysisId);

			return false;
		}

		return true;
	}

	filterStates(i_state, operator, value) {


		let filtered = Object.keys(this.state.steadyStates.table).reduce((filtered, key) => {
			let state = this.state.listStates[i_state];
			let celline = this.state.steadyStates.table[key];

			if (Object.keys(celline).includes(state)){

				if (operator === 0 && celline[state] < value) {
					filtered[key] = celline;
				}

				if (operator === 1 && celline[state] > value) {
					filtered[key] = celline;
				}
			}
			return filtered;
		}, {});

		this.setState(prevState => ({steadyStates: {...prevState.steadyStates, filteredTable: filtered}}));

	}

	clearFilters() {
		this.setState(prevState => ({steadyStates: {...prevState.steadyStates, filteredTable: prevState.steadyStates.table}}));
	}

	render() {

		if (this.props.analysisId !== null) {
			return (
				<React.Fragment>
					<FiltersForm
						status={this.state.showFiltersForm} toggle={this.toggleFiltersForm}
						listStates={this.state.listStates} filterStates={this.filterStates}
						clearFilters={this.clearFilters}
					/>
					<Nav tabs style={{"justifyContent": "space-between"}}>
						<div className={"d-flex"} style={{"justifyContent": "flex-start"}}>
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
						</div>
						<Button onClick={this.toggleFiltersForm}><FontAwesomeIcon icon={faFilter}/></Button>
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<TabPane tabId="fp">
							<SensitivitySteadyStates
								project={this.props.project}
								analysisId={this.props.analysisId}
								analysisStatus={this.state.analysisStatus}
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
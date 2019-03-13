import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";
import "./table-results.scss";
import Settings from "../../../Settings";


class SensitivitySteadyStates extends React.Component {

	static nbPerPage = 10;

	constructor(props) {

		super(props);

		this.state = {
			listStates: [],
			colorMap: {},
			page: 0,
			nbPages: 1,
		};

		this.changePage = this.changePage.bind(this);
		this.makeLinks = this.makeLinks.bind(this);
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

		this.setState({listStates: res, colorMap: colors});
	}

	computePages(table) {

		this.setState({page: 0, nbPages: Math.ceil(Object.keys(table).length / SensitivitySteadyStates.nbPerPage)})

	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {

		if (nextProps.steadyStates.loaded && this.props.steadyStates.filteredTable !== nextProps.steadyStates.filteredTable) {

			this.computeStateList(nextProps.steadyStates.filteredTable);
			this.computePages(nextProps.steadyStates.filteredTable);

			return false;
		}

		return true;
	}

	changePage(page) {
		this.setState({page: page});
	}

	makeLinks(nbPages) {

		let res = [];
		let i;
		for (i=0; i < nbPages; i++) {

			if (i == this.state.page) {
				res.push(<span className="item_page" key={i}>{i+1}</span>);
			} else {
				const page = i;
				res.push(<a href="#" key={i} onClick={(e) => {e.preventDefault(); this.changePage(page);}}><span className="item_page">{i+1}</span></a>);
			}
			if (i < (nbPages - 1)) {
				res.push("-");
			}
		}
		return res;
	}

	render() {

		if (this.props.steadyStates.loaded) {

			return (
				<React.Fragment>
					<div className="list_results_steadystates">
					{
						Object.keys(this.props.steadyStates.filteredTable).map((name, index) => {
							if (
								index >= (this.state.page*SensitivitySteadyStates.nbPerPage)
								&& index < ((this.state.page+1)*SensitivitySteadyStates.nbPerPage)
							) {
								return <div className="result_steadystates" key={index}><PieChart
									title={name}
									table={this.props.steadyStates.filteredTable[name]}
									colorMap={this.state.colorMap}
								/></div>;
							}
						})
					}
					</div>
					<div className="list_pages">{this.makeLinks(this.state.nbPages)}</div>
				</React.Fragment>
			);
		} else if (this.props.analysisId !== null) {
			return <LoadingIcon width="3rem" percent={this.props.analysisStatus}/>
		} else {
			return <div/>
		}

	}
}

export default SensitivitySteadyStates;
import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";
import "./table-results.scss";


class SensitivitySteadyStates extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			listStates: [],
			colorMap: {}
		};
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
			colors[state] = this.props.colormap[index % this.props.colormap.length]
		});

		this.setState({listStates: res, colorMap: colors});
	}


	shouldComponentUpdate(nextProps, nextState, nextContext) {

		if (nextProps.steadyStates.loaded !== this.props.steadyStates.loaded && nextProps.steadyStates.loaded) {

			this.computeStateList(nextProps.steadyStates.table);

			return false;
		}

		return true;
	}

	render() {

		if (this.props.steadyStates.loaded) {


			return (
				<div className="list_results_steadystates">
				{
					Object.keys(this.props.steadyStates.table).map((name, index) => {

						return <div className="result_steadystates" key={index}><PieChart
							title={name}
							table={this.props.steadyStates.table[name]}
							colorMap={this.state.colorMap}
						/></div>;
					})
				}
				</div>
			);
		} else if (this.props.analysisId !== null) {
			return <LoadingIcon width="3rem" percent={this.props.analysisStatus}/>
		} else {
			return <div/>
		}

	}
}

export default SensitivitySteadyStates;
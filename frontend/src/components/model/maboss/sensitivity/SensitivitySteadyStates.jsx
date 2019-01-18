import React from "react";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import PieChart from "../../../charts/PieChart";
import "./table-results.scss";


class SensitivitySteadyStates extends React.Component {

	render() {

		if (this.props.steadyStates.loaded) {


			return (
				<div className="list_results_steadystates">
				{
					Object.keys(this.props.steadyStates.table).map((name, index) => {

						return <div className="result_steadystates" key={index}><PieChart
							title={name}
							table={this.props.steadyStates.table[name]}
							colormap={this.props.colormap}
						/></div>;
					})
				}
				</div>
			);
		} else if (this.props.analysisId !== null) {
			return <LoadingIcon width="3rem"/>
		} else {
			return <div/>
		}

	}
}

export default SensitivitySteadyStates;
import React from "react";
import {Pie} from "react-chartjs-2";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import APICalls from "../../../api/apiCalls";
import PieChart from "../../../charts/PieChart";
import "./table-results.scss";


class SensitivitySteadyStates extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			fptableLoaded: false,
			fptable: null,
		};

		this.fixedPointsChecker = null;
		this.getFixedPointsCall = null;
	}




	getFixedPoints(project_id, analysis_id) {

		this.setState({fptableLoaded: false, fptable: null});
		this.getFixedPointsCall = APICalls.MaBoSSCalls.getSensitivityAnalysisSteadyStates(project_id, analysis_id);
		this.getFixedPointsCall.promise.then(data => {
			if (data.status === "Finished") {
				clearInterval(this.fixedPointsChecker);
				this.setState({fptableLoaded: true, fptable: data.results})
			}
		});
	}


	componentDidMount() {
		this.fixedPointsChecker = setInterval(() => this.getFixedPoints(this.props.project, this.props.analysisId), 1000);
	}

	componentWillUnmount() {
		this.getFixedPointsCall.cancel();
		clearInterval(this.fixedPointsChecker);
	}

	render() {
		if (this.state.fptableLoaded) {


			return (
				<div className="list_results_steadystates">
				{
					Object.keys(this.state.fptable).map((name, index) => {

						return <div className="result_steadystates" key={index}><PieChart
							title={name}
							table={this.state.fptable[name]}
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
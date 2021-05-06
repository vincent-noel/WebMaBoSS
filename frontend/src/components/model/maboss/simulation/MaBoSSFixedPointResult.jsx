import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
// import Graph from "./Graph";
import './table-fixedpoints.scss';
import ModelGraphRaw from "../../../commons/ModelGraphRaw";


class MaboSSFixedPointResult extends Component {

	constructor(props) {
		super(props);

		this.state = {
			indSelectedSteadyState: null,
			selectedSteadyState: null,
		};
	}

	toggleGraph(ind, steady_state) {
		if (this.state.selectedSteadyState !== steady_state){
			this.setState({indSelectedSteadyState: ind, selectedSteadyState: steady_state});
		} else {
			this.setState({indSelectedSteadyState: null,selectedSteadyState: null});
		}
	}

	render() {
		if (this.props.data !== null && Object.keys(this.props.data).length > 0) {
			
			return (
				<React.Fragment>
				<div className="container" style={{overflow: 'auto'}}>
					<table className="table-steadystates">
					<thead><tr>
					<th></th>
					{Object.keys(this.props.data[0]).map((key, index) => {
						return <th key={key}
							data-toggle="tooltip" data-placement="top"
					   		title={key}

						><div><span>{key}</span></div></th>
					})}
					</tr></thead>

					<tbody>
					{this.props.data.map((steady_state, index) => {
						return (
							<tr key={index} className={this.state.indSelectedSteadyState === index ? "selected" : ""}>
								<td
								className="actions"
							>
								<button
									className="btn btn-primary"
									onClick={() => {this.toggleGraph(index, steady_state);}}
								>
									<FontAwesomeIcon icon={faEye} size="sm" />
								</button>
							</td>
							{Object.keys(steady_state).map((key, subindex) => {
								if (steady_state[key] > 0) {
									return <td
										key={subindex}
										className="active"
										data-toggle="tooltip"
										data-placement="top"
					   					title={key}
									></td>;
								} else {
									return <td
										key={subindex}
										className="inactive"
										data-toggle="tooltip"
										data-placement="top"
					   					title={key}
									></td>;
								}
							})}
							</tr>
						)})
					}
					</tbody>
				</table>
				</div>
				{
					this.state.selectedSteadyState !== null ?
						<React.Fragment>
							<br/><br/>
							
							<ModelGraphRaw
								project={this.props.project}
								modelId={this.props.modelId}
								state={this.state.selectedSteadyState}
							/>
							{/* <Graph
								project={this.props.project}
								modelId={this.props.modelId}
								steadyState={this.state.selectedSteadyState}
							/> */}
						</React.Fragment> : null
				}
				</React.Fragment>
			);


		} else {
			return <LoadingIcon width="3rem"/>;
		}

	}
}

export default MaboSSFixedPointResult;
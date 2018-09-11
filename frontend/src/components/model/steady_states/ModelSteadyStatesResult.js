import React, {Component} from "react";
import {getAPIKey, getProject} from "../../commons/sessionVariables";

class ModelSteadyStatesResult extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			loaded: false,
		};
	}

	getGraph() {

		// Getting the graph via the API
		fetch(
			"/api/logical_model/" + getProject() + "/" + this.props.modelId + "/steady_states",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {
			return response.json();
		})

		// Finally, setting state
		.then(
			data => this.setState({data: data, loaded: true})
		);
	}

	componentDidMount() {
		this.getGraph();
	}

	render() {
		if (this.state.loaded) {

			const style_active = { 'backgroundColor': 'green' };
			const style_inactive = { 'backgroundColor': 'red' };

			return (
				<table style={{maxWidth: "100%", minWidth: "100%"}}>
					<thead><tr>
					<th>#</th>
					{Object.keys(this.state.data[0]).map((key, index) => {
						return <th key={key} data-toggle="tooltip" data-placement="top" title={key}></th>
					})}
					</tr></thead>

					<tbody>
					{this.state.data.map((steady_state, index) => {
						return (
							<tr key={index}>
								<td>{index}</td>
							{Object.keys(steady_state).map((key, subindex) => {
								if (steady_state[key] > 0) {
									return <td key={subindex} style={style_active}></td>;
								} else {
									return <td key={subindex} style={style_inactive}></td>;
								}
							})}
							</tr>
						)})
					}
					</tbody>
				</table>
			);


		} else {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />;
		}

	}
}

export default ModelSteadyStatesResult;
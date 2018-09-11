import React, {Component} from "react";
import {getAPIKey, getProject} from "../../commons/sessionVariables";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';

class ModelSteadyStatesResult extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: null,
			loaded: false,
			graph: null
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


	getGraphBySteadyState(i_steady_state) {

			const body = new FormData();
			body.append('steady_state', JSON.stringify(this.state.data[i_steady_state]));
			fetch(
			"/api/logical_model/" + getProject() + "/" + this.props.modelId + "/graph",
			{
				method: "post",
				body: body,
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {	return response.blob(); })

		// toBase64
		.then(
			blob => new Promise((resolve, reject) => {
				const reader = new FileReader;
				reader.onerror = reject;
				reader.onload = () => {
					resolve(reader.result);
				};
				reader.readAsDataURL(blob);
			})
		)

		// Finally, setting state
		.then(
			data => {
				this.setState({graph: data});
			}
		);
	}

	componentDidMount() {
		this.getGraph();
	}

	render() {
		if (this.state.loaded) {
			console.log(this.state.data);
			const style_active = { 'backgroundColor': 'green', 'height': '1rem', 'border': '1px solid black'};
			const style_inactive = { 'backgroundColor': 'red', 'height': '1rem', 'border': '1px solid black'};

			return (
				<React.Fragment>
				<table style={{maxWidth: "100%", minWidth: "100%"}}>
					<thead><tr>
					{Object.keys(this.state.data[0]).map((key, index) => {
						return <th key={key}
							data-toggle="tooltip" data-placement="top"
					   		title={key} style={{'height': '1rem'}}
						></th>
					})}
					<th></th>
					</tr></thead>

					<tbody>
					{this.state.data.map((steady_state, index) => {
						return (
							<tr key={index}>
							{Object.keys(steady_state).map((key, subindex) => {
								if (steady_state[key] > 0) {
									return <td key={subindex} style={style_active}></td>;
								} else {
									return <td key={subindex} style={style_inactive}></td>;
								}
							})}
							<td style={{'width': '1rem', 'height': '1rem', 'border': '1px solid black'}}>
								<button className="btn btn-primary" style={{padding: '0 0.5rem'}} onClick={() => {this.getGraphBySteadyState(index);}}>
									<FontAwesomeIcon icon={faEye} size="sm" />
								</button>
							</td>
							</tr>
						)})
					}
					</tbody>
				</table>

				{
					this.state.graph !== null ?
						<img
							src={this.state.graph}
							style={{
								'maxWidth': '100%',
								'maxHeight': '100%'
							}}
						/> : null
				}
				</React.Fragment>
			);


		} else {
			return <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />;
		}

	}
}

export default ModelSteadyStatesResult;
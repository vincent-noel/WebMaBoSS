import React from "react";
import {NavLink} from "react-router-dom";
import {setModel, getModel, clearModel, getAPIKey} from "../commons/sessionVariables";
import {getModelsFromAPI} from "../commons/apiCalls";
import LoadingIcon from "../commons/LoadingIcon";


class ModelDropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			models: [],
		};
	}

	getModels(project_id) {
		getModelsFromAPI(project_id)
		.then(models => {
			this.setState({ models: models, loaded: true });
		});
	}

	componentDidMount(){
		this.getModels(this.props.project);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.project !== this.props.project) {
			this.getModels(nextProps.project);
			return false;
		}

		if (nextState.models !== this.state.models) {
			this.props.onModelChanged(nextProps.project, nextState.models[0].id);
		}

		return true;
	}

	render() {

		if (!this.state.loaded) {
			return <LoadingIcon width="1rem" />;

		} else {
			const style = {
				width: "12rem"
			};
			return (
				<div className="dropdown" align="center">
					<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
							data-toggle="dropdown"
							aria-haspopup="true" aria-expanded="false" style={style}>
						{this.props.modelName}
					</button>
					<div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton" style={style}>
						{this.state.models.map((model, id) => {
							return <NavLink
								to={this.props.path}
								className="dropdown-item bg-dark" key={model.id}
								onClick={() => this.props.onModelChanged(this.props.project, model.id)}>{model.name}
							</NavLink>

						})}
					</div>
				</div>
			);
		}
	}
}

export default ModelDropdown;

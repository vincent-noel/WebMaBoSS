import React from "react";
import {NavLink} from "react-router-dom";
import LoadingIcon from "../commons/loaders/LoadingIcon";


class ModelDropdown extends React.Component {

	componentDidMount(){
		this.props.getModels(this.props.project);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.project !== this.props.project) {
			this.props.getModels(nextProps.project);
			return false;
		}

		if (nextProps.models !== this.props.models) {

			if (nextProps.models.length === 0) {
				return false;
			}

			const modelIds = Object.keys(nextProps.models).reduce((acc, key) => {
				acc.push(nextProps.models[key]['id']);
				return acc;
			}, []);

			if (nextProps.modelId !== null && modelIds.includes(nextProps.modelId))
			{
				this.props.onModelChanged(nextProps.project, nextProps.modelId);
			}
			else {
				if (nextProps.models.length > 0){
					this.props.onModelChanged(nextProps.project, nextProps.models[0].id);
				}
			}
		}

		return true;
	}

	render() {

		if (!this.props.loaded) {
			return <LoadingIcon width="1rem" />;

		} else {
			const style = {
				width: "12rem", overflowX: "hidden", textOverflow: "ellipsis"
			};
			return (
				<div className="dropdown" align="center">
					<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
							data-toggle="dropdown"
							aria-haspopup="true" aria-expanded="false" style={style}>
						{this.props.modelName !== null ? this.props.modelName : <LoadingIcon width="1rem"/>}
					</button>
					<div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton" style={style}>
						{this.props.models.map((model, id) => {
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

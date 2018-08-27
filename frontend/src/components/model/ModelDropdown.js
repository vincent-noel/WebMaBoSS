import React from "react";
import {NavLink} from "react-router-dom";

class ModelDropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			models: [],
		};

		this.onModelChanged.bind(this);
	}


	getModels() {
		fetch("/api/logical_models/")
			.then(response => {
				// if (response.status !== 200) {
				// 	return this.setState({ placeholder: "Something went wrong" });
				// }
				return response.json();
			})
			.then(data => this.setState({ models: data, loaded: true }));
	}

	componentDidMount(){
		this.getModels();
	}

	onModelChanged(e, model_id, name) {
		this.props.onModelChanged(e, model_id);
	}

	render() {

		if (!this.state.loaded) {
			return  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" width="20px"/>;

		} else {
			const style = {
				width: "100%"
			};
			return (
				<div className="dropdown container-fluid">
					<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
							data-toggle="dropdown"
							aria-haspopup="true" aria-expanded="false" style={style}>
						{this.props.modelName}
					</button>
					<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						{this.state.models.map((model, id) => {
							return <NavLink
								to={this.props.path.replace(":modelId", model.id)}
								className="dropdown-item" key={model.id}
								onClick={(e) => this.onModelChanged(e, model.id, model.name)}>{model.name}
							</NavLink>

						})}
					</div>
				</div>
			);
		}
	}
}

export default ModelDropdown;

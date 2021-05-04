import React from "react";
import {NavLink} from "react-router-dom";
import MyDropdown from "../commons/buttons/MyDropdown";
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
			return <MyDropdown
				label={this.props.modelName !== null ? this.props.modelName : <LoadingIcon width="1rem"/>}
				dict={this.props.models.reduce((result, model, ind)=>{
					result[ind] = model.name;
					return result;
				}, {})}
				callback={ind=>{ return this.props.onModelChanged(this.props.project, this.props.models[ind].id);}}
				width={"12rem"}
			/>;
		}
	}
}

export default ModelDropdown;

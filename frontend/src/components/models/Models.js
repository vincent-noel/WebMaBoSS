import React from "react";
import {Button} from "reactstrap";
import FullPage from "../FullPage";
import LogicalModels from "./LogicalModels";
import TableModels from "./TableModels";
import ModelForm from "./ModelForm";
import {getProject} from "../commons/sessionVariables";

class Models extends React.Component {

	constructor(props) {
		super(props);

		this.showModelForm = this.showModelForm.bind(this);
		this.hideModelForm = this.hideModelForm.bind(this);
		this.updateProject = this.updateProject.bind(this);
		this.state = {
			showModelForm: false,
			idModelForm: null,
			project: getProject()
		}
	}

	showModelForm(idProjectForm=null) {
		this.setState({
			showModelForm: true,
			idModelForm: idProjectForm
		})
	}

	hideModelForm() {
		this.setState({
			showModelForm: false
		})
	}

	updateProject() {
		this.setState({project: getProject()});
	}

	render () {
		return (
			<FullPage path={this.props.match.path} updateProject={this.updateProject}>
				<h2>Models</h2>
				<LogicalModels endpoint="/api/logical_models/"
					render={(data, updateParent) => {
						return <React.Fragment>
							<TableModels data={data} updateParent={updateParent} edit={this.showModelForm} project={this.state.project}/>

							<Button type="button" color="primary" onClick={() => {this.showModelForm(null)}}>New model</Button>

							<ModelForm
								updateParent={this.updateParent}
								status={this.state.showModelForm}
								id={this.state.idModelForm}
								show={this.showModelForm}
								hide={this.hideModelForm}
							/>
						</React.Fragment>
						}
					}
				/>
			</FullPage>
		)
	}
}

export default Models;

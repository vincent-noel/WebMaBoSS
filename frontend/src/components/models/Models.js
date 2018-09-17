import React from "react";
import {Button} from "reactstrap";
import FullPage from "../FullPage";
import LogicalModels from "./LogicalModels";
import TableModels from "./TableModels";
import ModelForm from "./ModelForm";
import {getProject} from "../commons/sessionVariables";
import ExportModelForm from "./ExportModelForm";

class Models extends React.Component {

	constructor(props) {
		super(props);

		this.showModelForm = this.showModelForm.bind(this);
		this.hideModelForm = this.hideModelForm.bind(this);
		this.showExportModelForm = this.showExportModelForm.bind(this);
		this.hideExportModelForm = this.hideExportModelForm.bind(this);
		this.updateProject = this.updateProject.bind(this);

		this.state = {
			showModelForm: false,
			idModelForm: null,
			showExportModelForm: false,
			idExportModelForm: null,
			filenameExportModelForm: null,
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

	showExportModelForm(id, filename) {
		this.setState({
			showExportModelForm: true,
			idExportModelForm: id,
			filenameExportModelForm: filename,
		})
	}

	hideExportModelForm() {
		this.setState({
			showExportModelForm: false,
			idExportModelForm: null,
			filenameExportModelForm: null
		})
	}

	updateProject(project) {
		this.setState({project: project});
	}

	render () {
		return (
			<FullPage path={this.props.match.path} updateProject={this.updateProject}>
				<h2>Models</h2>
				<LogicalModels endpoint="/api/logical_models/"
					render={(data, updateParent) => {
						return <React.Fragment>
							<TableModels
								data={data}
								updateParent={updateParent}
								edit={this.showModelForm}
								project={this.state.project}
								download={this.showExportModelForm}
							/>

							<Button type="button" color="primary" onClick={() => {this.showModelForm(null)}}>New model</Button>

							<ModelForm
								updateParent={updateParent}
								status={this.state.showModelForm}
								id={this.state.idModelForm}
								show={this.showModelForm}
								hide={this.hideModelForm}
							/>
							<ExportModelForm
								project={this.state.project}
								id={this.state.idExportModelForm}
								filename={this.state.filenameExportModelForm}
								status={this.state.showExportModelForm}
								show={this.showExportModelForm}
								hide={this.hideExportModelForm}
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

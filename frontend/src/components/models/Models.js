import React from "react";
import {Button} from "reactstrap";
import FullPage from "../FullPage";
import LogicalModels from "./LogicalModels";
import TableModels from "./TableModels";
import ModelForm from "./ModelForm";
import ExportModelForm from "./ExportModelForm";
import {ProjectContext} from "../context";


class Models extends React.Component {

	constructor(props) {
		super(props);

		this.showModelForm = this.showModelForm.bind(this);
		this.hideModelForm = this.hideModelForm.bind(this);
		this.showExportModelForm = this.showExportModelForm.bind(this);
		this.hideExportModelForm = this.hideExportModelForm.bind(this);

		this.state = {
			showModelForm: false,
			idModelForm: null,
			showExportModelForm: false,
			idExportModelForm: null,
			filenameExportModelForm: null,
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


	render () {
		return (
			<FullPage path={this.props.match.path}>
				<h2>Models</h2>
				<ProjectContext>
					{(projectContext => <LogicalModels
						endpoint="/api/logical_models/"
						project={projectContext.project}
						render={(data, updateParent) => {
							return <React.Fragment>
								<TableModels
									data={data}
									updateParent={updateParent}
									edit={this.showModelForm}
									project={projectContext.project}
									download={this.showExportModelForm}
								/>

								<Button type="button" color="primary" onClick={() => {this.showModelForm(null)}}>New model</Button>

								<ModelForm
									project={projectContext.project}
									updateParent={updateParent}
									status={this.state.showModelForm}
									id={this.state.idModelForm}
									show={this.showModelForm}
									hide={this.hideModelForm}
								/>
								<ExportModelForm
									project={projectContext.project}
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
					)}
				</ProjectContext>
			</FullPage>
		)
	}
}

export default Models;

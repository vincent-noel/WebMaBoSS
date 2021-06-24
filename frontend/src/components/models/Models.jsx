import React from "react";
import {Button, ButtonToolbar} from "reactstrap";
import FullPage from "../FullPage";
import LogicalModels from "./LogicalModels";
import TableModels from "./TableModels";
import ModelForm from "./ModelForm";
import ExportModelForm from "./ExportModelForm";
import {ProjectContext} from "../context";
import TagForm from "./TagForm";
import ImportModel from "./ImportModel";
import ErrorAlert from "../commons/ErrorAlert";


class Models extends React.Component {

	constructor(props) {
		super(props);

		this.showErrors = this.showErrors.bind(this);
		this.showModelForm = this.showModelForm.bind(this);
		this.hideModelForm = this.hideModelForm.bind(this);
		this.showExportModelForm = this.showExportModelForm.bind(this);
		this.hideExportModelForm = this.hideExportModelForm.bind(this);
		this.showTagModelForm = this.showTagModelForm.bind(this);
		this.hideTagModelForm = this.hideTagModelForm.bind(this);
		this.showModelImport = this.showModelImport.bind(this);
		this.hideModelImport = this.hideModelImport.bind(this);

		this.state = {
			showModelForm: false,
			idModelForm: null,
			showExportModelForm: false,
			idExportModelForm: null,
			tagExportModelForm: null,
			showTagModelForm: false,
			idTagModelForm: null,
			showModelImport: false,
			errors: []
		}
	}
	
	showErrors(errors) {
		this.setState({errors: errors});
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
	
	showModelImport() {
		this.setState({
			showModelImport: true,
		})
	}

	hideModelImport() {
		this.setState({
			showModelImport: false
		})
	}

	showExportModelForm(id, tag) {
		this.setState({
			showExportModelForm: true,
			idExportModelForm: id,
			tagExportModelForm: tag,
		})
	}

	hideExportModelForm() {
		this.setState({
			showExportModelForm: false,
			idExportModelForm: null,
		})
	}

	showTagModelForm(id) {
		this.setState({showTagModelForm: true, idTagModelForm: id})
	}

	hideTagModelForm() {
		this.setState({showTagModelForm: false, idTagModelForm: null})
	}

	render () {
		return (
			<FullPage path={this.props.match.path}>
				<h2>Models</h2><br/>
				<ErrorAlert errorMessages={this.state.errors}/>
				<ProjectContext.Consumer>
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
									tag={this.showTagModelForm}
								/>
								<ButtonToolbar className="justify-content-start">
									<Button className="mr-1" type="button" color="primary" onClick={() => {this.showModelForm(null)}}>Load model</Button>
									<Button className="mr-1" type="button" color="primary" onClick={() => {this.showModelImport(null)}}>Import model</Button>
								</ButtonToolbar>
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
									tag={this.state.tagExportModelForm}
									status={this.state.showExportModelForm}
									show={this.showExportModelForm}
									hide={this.hideExportModelForm}
								/>
								{/* <TagForm
									project={projectContext.project}
									id={this.state.idTagModelForm}
									status={this.state.showTagModelForm}
									show={this.showTagModelForm}
									hide={this.hideTagModelForm}
									showExport={this.showExportModelForm}
								/> */}
								<ImportModel
									project={projectContext.project}
									updateParent={updateParent}
									status={this.state.showModelImport}
									show={this.showModelImport}
									hide={this.hideModelImport}
									showErrors={this.showErrors}
								/>
							</React.Fragment>
						}
					}
				/>
					)}
				</ProjectContext.Consumer>
			</FullPage>
		)
	}
}

export default Models;

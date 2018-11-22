import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../api/apiCalls";
import MyDropdown from "../commons/buttons/MyDropdown";

class ModelForm extends React.Component {

	constructor(props) {
		super(props);

		this.dictFormats = {
			'zginml': "Z-GINML (Extended save)",
			// 'sbml': "SBML qual",
			'maboss': "MaBoSS"
		};

		this.dictLabels = {
			'zginml': ['Z-GINML file'],
			'maboss': ['BND file', 'CFG file'],
			'sbml': ['SBML file'],
		};

		this.dictExtensions = {
			'zginml': ['.zginml'],
			'maboss': ['.bnd', '.cfg'],
			'sbml': ['.xml, .sbml'],
		};

		this.dictNbFiles = {
			'zginml': 1,
			'maboss': 2,
			'sbml': 1
		};

		this.state = {
			id: null,
			name: "",
			file: null,
			fileName: "Select file... ",
			file2: null,
			file2Name: "Select file...",
			modal: false,
			type: 'zginml'

		};

		this.toggle = this.toggle.bind(this);
		this.handleNameChange.bind(this);
		this.handleFileChange.bind(this);
		this.handleSubmit.bind(this);

		this.importModelCall = null;
	}

	toggle() {
		this.setState({modal: !this.state.modal});
	}

	handleNameChange(e) {
		this.setState({name: e.target.value});
	};

	handleFileChange(e) {
		this.setState({file: e.target.files[0], fileName: e.target.files[0].name});
	};

	handleFile2Change(e) {
		this.setState({file2: e.target.files[0], file2Name: e.target.files[0].name});
	};

	handleTypeChange(type) {
		this.setState({type: type})
	}

	handleSubmit(e) {
		e.preventDefault();

		this.importModelCall = APICalls.ModelsCalls.importModel(this.props.project, this.state.file, this.state.name, this.state.file2);
		this.importModelCall.promise.then(response => {

			this.setState({
				name: "",
				file: null,
				fileName: "Select file...",
				file2: null,
				modal: false,
				type: 'zginml'
			});
			this.props.hide();
			this.props.updateParent();
		});

	};


	shouldComponentUpdate(nextProps, nextState) {

		if (nextState.type !== this.state.type) {
			this.setState({
				file: null,
				filename: "Select file...",
				file2: null,
				file2Name: "Select file",
			});
			return false;
		}

		if (nextProps.id !== this.props.id ){

			if (nextProps.id !== null) {

				this.setState({
					id: nextProps.id.id,
					name: nextProps.id.name,
				});
			} else {
				this.setState({
					id: null,
					name: "",
				});
			}
		}
		return true;
	}

	componentWillUnmount() {
		if (this.importModelCall !== null) this.importModelCall.cancel();
	}

	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {if (this.props.status) {this.props.hide();} else {this.props.show(this.state.id)}}}>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<Card>
						<CardHeader>{this.state.id !== null ? "Edit" : "Create new"} model</CardHeader>
						<CardBody>
							<div className="form-group">
								<label htmlFor="modelName">Name</label>
								<input
									id="modelName"
									className="form-control"
									type="text"
									name="name"
									onChange={(e) => this.handleNameChange(e)}
									value={this.state.name}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="modelFile">Type</label>
								<MyDropdown
									values={this.dictFormats}
									width={"28rem"}
									value={this.state.type}
									onItemSelected={(item)=> this.handleTypeChange(item)}
									loaded={true}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="modelFile">{this.dictLabels[this.state.type][0]}</label>
								<div className="custom-file" id="customFile">
									<input
										id="modelFile"
										type="file"
										className="custom-file-input"
										name="file"
										onChange={(e) => this.handleFileChange(e)}
										accept={this.dictExtensions[this.state.type][0]}
										aria-describedby="fileHelp" required/>
									<label className="custom-file-label"
										   htmlFor="modelFile">{this.state.fileName}</label>
								</div>
							</div>
							{( this.dictNbFiles[this.state.type] === 2 ?
							<div className="form-group">
								<label htmlFor="model2File">{this.dictLabels[this.state.type][1]}</label>
								<div className="custom-file" id="customFile2">
									<input
										id="model2File"
										type="file"
										className="custom-file-input"
										name="file2"
										onChange={(e) => this.handleFile2Change(e)}
										accept={this.dictExtensions[this.state.type][1]}
										aria-describedby="fileHelp" required/>
									<label className="custom-file-label"
										   htmlFor="model2File">{this.state.file2Name}</label>
								</div>
							</div> : null )}
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => this.props.hide()}>Close</Button>
								<Button type="submit" color="primary" className="ml-auto">Load model</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default ModelForm;
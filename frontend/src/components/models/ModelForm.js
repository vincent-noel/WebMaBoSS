import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../commons/apiCalls";

class ModelForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: null,
			name: "",
			file: undefined,
			fileName: "Select file... ",
			modal: false

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

	handleSubmit(e) {
		e.preventDefault();

		this.importModelCall = APICalls.importModel(this.props.project, this.state.file, this.state.name);
		this.importModelCall.promise.then(response => {

			this.setState({
				name: "",
				file: undefined,
				fileName: "Select file...",
				modal: false
			});
			this.props.hide();
			this.props.updateParent();
		});

	};


	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.id != this.props.id ){

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
								<label htmlFor="modelFile">File</label>
								<div className="custom-file" id="customFile">
									<input
										id="modelFile"
										type="file"
										className="custom-file-input"
										name="file"
										onChange={(e) => this.handleFileChange(e)}
										aria-describedby="fileHelp" required/>
									<label className="custom-file-label"
										   htmlFor="modelFile">{this.state.fileName}</label>
								</div>
							</div>
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
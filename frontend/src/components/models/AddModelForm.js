import React from "react";
import {Button, ButtonGroup, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import getCSRFToken from "../commons/getCSRFToken";

class AddModelForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			file: undefined,
			fileName: "Select file... ",
			modal: false

		};
		this.toggle = this.toggle.bind(this);
		this.handleNameChange.bind(this);
		this.handleFileChange.bind(this);
		this.handleSubmit.bind(this);
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

		const formData = new FormData();
		formData.append('file', this.state.file);
		formData.append('name', this.state.name);

		const conf = {
			method: "post",
			body: formData,
			headers: new Headers({
				'Authorization': "Token " + sessionStorage.getItem("api_key"),
				'X-CSRFToken': getCSRFToken()
			})
		};

		fetch("/api/logical_models/" + sessionStorage.getItem('project') + "/", conf)
			.then(response => {

				this.setState({
					name: "",
					file: undefined,
					fileName: "Select file...",
					modal: false
				});
				this.props.updateParent();
			});

	};

	render() {
		return <React.Fragment>
			<Button type="button" color="primary" onClick={this.toggle}>
				New model
			</Button>
			<Modal isOpen={this.state.modal} toggle={this.toggle}>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<Card>
						<CardHeader>Add new model</CardHeader>
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
							<ButtonGroup className="d-flex">
								<Button color="danger" className="mr-auto" onClick={this.toggle}>Close</Button>
								<Button type="submit" color="primary" className="ml-auto">Load model</Button>
							</ButtonGroup>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default AddModelForm;
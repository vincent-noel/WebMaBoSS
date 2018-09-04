import React from "react";
import {Button, ButtonGroup, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import getCSRFToken from "../commons/getCSRFToken";

class AddProjectForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			description: "",
			modal: false

		};
		this.toggle = this.toggle.bind(this);
		this.handleNameChange.bind(this);
		this.handleDescriptionChange.bind(this);
		this.handleSubmit.bind(this);
	}

	toggle() {
		this.setState({modal: !this.state.modal});
	}

	handleNameChange(e) {
		this.setState({name: e.target.value});
	};

	handleDescriptionChange(e) {
		this.setState({description: e.target.value});
	};

	handleSubmit(e) {
		e.preventDefault();

		const formData = new FormData();
		formData.append('project', sessionStorage.getItem('project'));
		formData.append('name', this.state.name);
		formData.append('description', this.state.description);

		const conf = {
			method: "post",
			body: formData,
			headers: new Headers({
				'Authorization': "Token " + sessionStorage.getItem("api_key"),
			})
		};

		fetch("/api/projects/", conf)
			.then(response => {

				this.setState({
					name: "",
					description: "",
					modal: false
				});
				this.props.updateParent();
			});

	};

	render() {
		return <React.Fragment>
			<Button type="button" color="primary" onClick={this.toggle}>
				New project
			</Button>
			<Modal isOpen={this.state.modal} toggle={this.toggle}>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<Card>
						<CardHeader>Add new project</CardHeader>
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
								<label htmlFor="modelDescription">Description</label>
								<textarea
									className="form-control"
									id="modelDescription"
									rows="6"
									placeholder="Enter a brief description of the project"
									onChange={(e) => this.handleDescriptionChange(e)}
								>
								</textarea>
							</div>
						</CardBody>
						<CardFooter>
							<ButtonGroup className="d-flex">
								<Button color="danger" className="mr-auto" onClick={this.toggle}>Close</Button>
								<Button type="submit" color="primary" className="ml-auto">Create model</Button>
							</ButtonGroup>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default AddProjectForm;
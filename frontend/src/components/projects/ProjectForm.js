import React from "react";
import {Button, ButtonGroup, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";

class ProjectForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: null,
			name: "",
			description: "",
			// modal: false

		};
		this.handleNameChange.bind(this);
		this.handleDescriptionChange.bind(this);
		this.handleSubmit.bind(this);
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
		formData.append('name', this.state.name);
		formData.append('description', this.state.description);

		const conf = {
			method: this.state.id === null ? "post" : "put",
			body: formData,
			headers: new Headers({
				'Authorization': "Token " + sessionStorage.getItem("api_key"),
			})
		};

		fetch("/api/projects/" + (this.state.id !== null ? this.state.id : ""), conf)
			.then(response => {

				this.props.hide();
				this.setState({
					id: null,
					name: "",
					description: "",
				});
				this.props.updateProjects();
			});
	};

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.id != this.props.id ){

			if (nextProps.id !== null) {

				this.setState({
					id: nextProps.id.id,
					name: nextProps.id.name,
					description: nextProps.id.description,
				});
			} else {
				this.setState({
					id: null,
					name: "",
					description: "",
				});
			}
		}
		return true;
	}

	render() {

		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {if (this.props.status) {this.props.hide()} else {this.props.show(this.props.id)}}}>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<Card>
						<CardHeader>{(this.props.id !== null) ? "Editing a project" : "Add new project"}</CardHeader>
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
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {if (this.props.status) {this.props.hide()} else {this.props.show(this.props.id)}}}>Close</Button>
								<Button type="submit" color="primary" className="ml-auto">{this.props.id !== null ? "Save" : "Create"} project</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default ProjectForm;
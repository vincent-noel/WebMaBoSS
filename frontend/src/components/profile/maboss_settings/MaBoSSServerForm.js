import React from "react";
import {Button, ButtonGroup, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import {getAPIKey} from "../../commons/sessionVariables";

class MaBoSSServerForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: null,
			host: "",
			port: "",

		};
		this.handleHostChange.bind(this);
		this.handlePortChange.bind(this);
		this.handleSubmit.bind(this);
	}

	handleHostChange(e) {
		this.setState({host: e.target.value});
	};

	handlePortChange(e) {
		this.setState({port: e.target.value});
	};

	handleSubmit(e) {
		e.preventDefault();

		const formData = new FormData();
		formData.append('host', this.state.host);
		formData.append('port', this.state.port);

		const conf = {
			method: this.state.id === null ? "post" : "put",
			body: formData,
			headers: new Headers({
				'Authorization': "Token " + getAPIKey(),
			})
		};

		fetch(this.props.endpoint + (this.state.id !== null ? this.state.id : ""), conf)
			.then(response => {

				this.props.hide();
				this.setState({
					id: null,
					host: "",
					port: "",
				});
				this.props.updateServers();
			});
	};

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.id !== this.props.id ){

			if (nextProps.id !== null) {

				this.setState({
					id: nextProps.id.id,
					host: nextProps.id.host,
					port: nextProps.id.port,
				});
			} else {
				this.setState({
					id: null,
					host: "",
					port: "",
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
						<CardHeader>{(this.props.id !== null) ? "Editing a MaBoSS server" : "Add new MaBoSS server"}</CardHeader>
						<CardBody>
							<div className="form-group">
								<label htmlFor="serverHost">Host</label>
								<input
									id="serverHost"
									className="form-control"
									type="text"
									name="host"
									onChange={(e) => this.handleHostChange(e)}
									value={this.state.host}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="serverPort">Description</label>
								<input
									id="serverPort"
									className="form-control"
									type="text"
									name="port"
									onChange={(e) => this.handlePortChange(e)}
									value={this.state.port}
									required
								/>
							</div>
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {if (this.props.status) {this.props.hide()} else {this.props.show(this.props.id)}}}>Close</Button>
								<Button type="submit" color="primary" className="ml-auto">{this.props.id !== null ? "Save" : "Add"} server</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default MaBoSSServerForm;
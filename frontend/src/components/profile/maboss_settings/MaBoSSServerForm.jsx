import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import APICalls from "../../api/apiCalls";

class MaBoSSServerForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: null,
			desc: "",
			host: "",
			port: "",

		};

		this.apiCall = null;
	}

	handleDescChange(e) {
		this.setState({desc: e.target.value});
	}

	handleHostChange(e) {
		this.setState({host: e.target.value});
	};

	handlePortChange(e) {
		this.setState({port: e.target.value});
	};

	handleSubmit(e) {
		e.preventDefault();
		if (this.apiCall !== null) this.apiCall.cancel();

		if (this.state.id === null)
			this.apiCall = APICalls.MaBoSSServerCalls.createMaBoSSServer(
				this.state.host, this.state.port, this.state.desc
			);
		else
			this.apiCall = APICalls.MaBoSSServerCalls.updateMaBoSSServer(
				this.state.host, this.state.port, this.state.desc, this.state.id
			);

		this.apiCall.promise.then(response => {

				this.props.hide();
				this.setState({
					id: null,
					desc: "",
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
					desc: nextProps.id.desc,
					host: nextProps.id.host,
					port: nextProps.id.port,
				});
			} else {
				this.setState({
					id: null,
					desc: "",
					host: "",
					port: "",
				});
			}
		}
		return true;
	}

	componentWillUnmount() {
		if (this.apiCall !== null) this.apiCall.cancel();
	}

	render() {

		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {if (this.props.status) {this.props.hide()} else {this.props.show(this.props.id)}}}>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<Card>
						<CardHeader>{(this.props.id !== null) ? "Editing a MaBoSS server" : "Add new MaBoSS server"}</CardHeader>
						<CardBody>
							<div className="form-group">
								<label htmlFor="serverDesc">Description</label>
								<input
									id="serverDesc"
									className="form-control"
									type="text"
									name="desc"
									onChange={(e) => this.handleDescChange(e)}
									value={this.state.desc}
									required
								/>
							</div>
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
								<label htmlFor="serverPort">Port</label>
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
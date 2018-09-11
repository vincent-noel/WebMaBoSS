import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import getCSRFToken from "../../commons/getCSRFToken";
import {getAPIKey, getProject} from "../../commons/sessionVariables";

class NewSimForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			sampleCount: 1000,
			maxTime: 50,
			timeTick: 1
		};

		this.handleSampleCountChange.bind(this);
		this.handleMaxTimeChange.bind(this);
		this.handleTimeTickChange.bind(this);
	}

	handleSampleCountChange(e) {
		this.setState({sampleCount: e.target.value});
	}

	handleMaxTimeChange(e) {
		this.setState({maxTime: e.target.value});
	}

	handleTimeTickChange(e) {
		this.setState({timeTick: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		this.props.onSubmit({
			sampleCount: this.state.sampleCount,
			maxTime: this.state.maxTime,
			timeTick: this.state.timeTick,
		});
	}
	// handleSubmit(e) {
	// 	e.preventDefault();
	//
	// 	const formData = new FormData();
	// 	formData.append('file', this.state.file);
	// 	formData.append('name', this.state.name);
	//
	// 	const conf = {
	// 		method: "post",
	// 		body: formData,
	// 		headers: new Headers({
	// 			'Authorization': "Token " + getAPIKey(),
	// 			'X-CSRFToken': getCSRFToken()
	// 		})
	// 	};
	//
	// 	fetch("/api/logical_models/" + getProject() + "/", conf)
	// 	.then(response => {
	//
	// 		this.setState({
	// 			name: "",
	// 			file: undefined,
	// 			fileName: "Select file...",
	// 			modal: false
	// 		});
	// 		this.props.updateParent();
	// 	});
	//
	// };

	//
	// shouldComponentUpdate(nextProps, nextState) {
	//
	// 	if (nextProps.id != this.props.id ){
	//
	// 		if (nextProps.id !== null) {
	//
	// 			this.setState({
	// 				id: nextProps.id.id,
	// 				name: nextProps.id.name,
	// 				// description: nextProps.id.description,
	// 			});
	// 		} else {
	// 			this.setState({
	// 				id: null,Comme discuté précedemment, je me marie le wee
	// 				name: "",
	// 				// description: "",
	// 			});
	// 		}
	// 	}
	// 	return true;
	// }


	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<Card>
						<CardHeader>Create new simulation</CardHeader>
						<CardBody>
							<div className="form-group row">
								<label htmlFor="sampleCount" className="col-sm-2 col-form-label">Sample count</label>
								<div className="col-sm-10">
									<input type="numbers" className="form-control" id="sampleCount" placeholder="1000"
										   value={this.state.sampleCount} onChange={(e) => this.handleSampleCountChange(e)}
									/>
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="maxTime" className="col-sm-2 col-form-label">Max time</label>
								<div className="col-sm-10">
									<input type="number" className="form-control" id="maxTime" placeholder="100"
										   value={this.state.maxTime} onChange={(e) => this.handleMaxTimeChange(e)}
									/>
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="timeTick" className="col-sm-2 col-form-label">Time tick</label>
								<div className="col-sm-10">
									<input type="number" className="form-control" id="timeTick" placeholder="1"
										   value={this.state.timeTick} onChange={(e) => this.handleTimeTickChange(e)}
									/>
								</div>
							</div>
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {this.props.toggle();}}>Close</Button>
								<Button type="submit" color="default" className="ml-auto">Submit</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default NewSimForm;
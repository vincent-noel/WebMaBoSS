import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import DeleteButton from "../commons/buttons/DeleteButton";
import APICalls from "../commons/apiCalls";
import LoadButton from "../commons/buttons/LoadButton";
import DownloadButton from "../commons/buttons/DownloadButton";


class TagForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			listOfTags: [],
			modal: false,
			tag: "",

		};
		this.toggle = this.toggle.bind(this);

		this.getTags = this.getTags.bind(this);
		this.updateListOfTags = this.updateListOfTags.bind(this);
		this.tag = this.tag.bind(this);

		this.getTagsCall = null;
		this.addTagCall = null;
		this.deleteTagCall = null;
	}

	toggle() {
		this.setState({modal: !this.state.modal});
	}

	getTags(project_id, model_id) {
		this.setState({listOfTags: []});
		this.getTagsCall = APICalls.listModelTags(project_id, model_id);
		this.getTagsCall.promise.then(tags => this.setState({listOfTags: tags}))
	}

	tag() {
		this.addTagCall = APICalls.createModelTag(this.props.project, this.props.id, this.state.tag);
		this.addTagCall.promise.then(response => this.updateListOfTags());
	}

	updateListOfTags() {
		this.getTags(this.props.project, this.props.id)
	}

	handleTagChange(e) {
		this.setState({tag: e.target.value});
	};

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.id !== this.props.id ){

			if (nextProps.id !== null) {
				this.getTags(nextProps.project, nextProps.id);

			} else {
				this.setState({
					listOfTags: [],
				});
			}
			return false;

		}
		return true;
	}

	componentWillUnmount() {
		if (this.getTagsCall !== null) this.getTagsCall.cancel();
		if (this.addTagCall !== null) this.addTagCall.cancel();
	}

	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {if (this.props.status) {this.props.hide();} else {this.props.show(this.state.id)}}}>
				<Card>
					<CardHeader>Tag model</CardHeader>
					<CardBody>
						{ this.state.listOfTags.length === 0 ? "No tagged versions" :
						<table className="table table-striped">
							<thead>
							  <tr className="d-flex">
									<th>Tagged versions</th>
									<th className="ml-auto"></th>
							  </tr>
							</thead>
							<tbody>
							  {this.state.listOfTags.map((tag, index) => (
								<tr key={index} className="d-flex">
									<td>{tag}</td>
									<td className="ml-auto">
										<LoadButton id={this.props.id} load={() => {}} size="sm"/>
										<DownloadButton onClick={() => {this.props.showExport(this.props.id, tag);}} size="sm"/>
									   <DeleteButton
										endpoint={"/api/logical_models/" + this.props.project + "/" + this.props.id + "/tags/"}
										update={this.updateListOfTags}
										id={tag} size="sm"
									/>
									</td>
								</tr>
							  ))}
							</tbody>
						  </table>}
						<br/><br/>
						<hr/>
						<div className="form-inline">
							<label htmlFor="modelTag" className="mr-2">Tag</label>
							<input
								id="modelTag"
								className="form-control"
								type="text"
								name="tag"
								onChange={(e) => this.handleTagChange(e)}
								value={this.state.tag}
								required
							/>
							<Button color="primary" className="ml-auto" onClick={this.tag}>Save</Button>
						</div>
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="ml-auto" onClick={() => this.props.hide()}>Close</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
			</Modal>
		</React.Fragment>;
	}
}

export default TagForm;
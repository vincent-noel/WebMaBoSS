import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import Dropdown from "../commons/Dropdown";
import {getAPIKey} from "../commons/sessionVariables";
import {saveAs} from "file-saver/FileSaver";

class ExportModelForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			format: 'zginml'
		};

		this.dictFormats = {
			'zginml': "Z-GINML Format (Extended save)",
			'sbml': "SBML qual"
		}
	}
	downloadZGINML() {
		fetch("/api/logical_models/" + this.props.project + "/" + this.props.id + "/file", {
			method: "get",
			headers: new Headers({'Authorization': "Token " + getAPIKey()}),
		})
		.then(response => response.blob())
		.then(blob => saveAs(blob, this.props.filename));
	}

	changeFormat(format) {
		this.setState({format: format});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.hide();
		switch(this.state.format) {
			case 'zginml':
				this.downloadZGINML();
				break;

			case 'sbml':
				break;

			default:
				break;
		}
	}

	render() {
		return <React.Fragment>
			<Modal
				isOpen={this.props.status}
				toggle={() => {
					if (this.props.status) { this.props.hide();}
					else { this.props.show(); }
				}}
			>
				<form onSubmit={(e) => this.handleSubmit(e)}>
					<Card>
						<CardHeader>Export model</CardHeader>
						<CardBody>
							<Dropdown
								width='25rem'
								selectedItem={this.dictFormats[this.state.format]}
							>
								{
									Object.keys(this.dictFormats).map((key, index) => {
										return <a
											key={index}
											href=""
											onClick={(e) => {
												e.preventDefault(); this.changeFormat(key);
											}}>{this.dictFormats[key]}
										</a>

								})}
							</Dropdown>
						</CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => this.props.hide()}>Close</Button>
								<Button type="submit" color="primary" className="ml-auto">Download</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		</React.Fragment>;
	}
}

export default ExportModelForm;
import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import MyDropdown from "../commons/buttons/MyDropdown";
import APICalls from "../api/apiCalls";

class ExportModelForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			format: 'zginml',
			buttonLabel: "Download",
			showSecondButton: false,
			secondButtonLabel: ""
		};

		this.dictFormats = {
			'zginml': "Z-GINML (Extended save)",
			'sbml': "SBML qual",
			'maboss': "MaBoSS"
		}
	}

	changeFormat(format) {
		if (format == 'maboss') {
			this.setState({format: format, buttonLabel: "Download model", showSecondButton: true, secondButtonLabel: "Download config"})
		} else {
			this.setState({format: format, buttonLabel: "Download", showSecondButton: false, secondButtonLabel: ""});
		}
	}

	handleSubmit(file_id) {

		switch(this.state.format) {
			case 'zginml':
				this.props.hide();
				APICalls.ModelsCalls.downloadModelAsZGINML(this.props.project, this.props.id, this.props.tag);
				break;

			case 'sbml':
				this.props.hide();
				APICalls.ModelsCalls.downloadModelAsSBML(this.props.project, this.props.id, this.props.tag);
				break;

			case 'maboss':
				APICalls.ModelsCalls.downloadModelAsMaBoSS(this.props.project, this.props.id, this.props.tag, file_id);

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
				<Card>
					<CardHeader>Export model</CardHeader>
					<CardBody>
						<MyDropdown
							width='25rem'
							label={this.dictFormats[this.state.format]}
							dict={this.dictFormats}
							callback={key => this.changeFormat(key)}
						/>
						
						<br/>
						{ this.state.showSecondButton ?
							<ButtonToolbar className="d-flex">
								<Button type="button" color="primary" className="ml-auto mr-2" onClick={() => this.handleSubmit(0)}>{this.state.buttonLabel}</Button>
								<Button type="button" color="primary" className="ml-2 mr-auto" onClick={() => this.handleSubmit(1)}>{this.state.secondButtonLabel}</Button>
							</ButtonToolbar>
							:
							<ButtonToolbar className="d-flex">
								<Button type="button" color="primary" className="ml-auto mr-auto" onClick={() => this.handleSubmit()}>{this.state.buttonLabel}</Button>
							</ButtonToolbar>
						}
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

export default ExportModelForm;
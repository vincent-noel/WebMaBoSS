import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";


class ConfirmationModal extends React.Component {

	constructor(props) {
		super(props);

		// this.state = {
		// 	modal: false,
		// };

		// this.toggle = this.toggle.bind(this);
	}
	//
	// toggle() {
	// 	this.setState({modal: !this.state.modal});
	// }
	//
	render() {
		return <React.Fragment>
			<Modal isOpen={this.props.status} toggle={() => {this.props.no()}}>
				<Card>
					<CardHeader>Please confirm</CardHeader>
					<CardBody>
						{this.props.message}
					</CardBody>
					<CardFooter>
						<ButtonToolbar className="d-flex">
							<Button color="danger" className="mr-auto" onClick={() => this.props.yes()}>Yes</Button>
							<Button color="danger" className="ml-auto" onClick={() => this.props.no()}>No</Button>
						</ButtonToolbar>
					</CardFooter>
				</Card>
			</Modal>
		</React.Fragment>;
	}
}

export default ConfirmationModal;
import React from "react";
import {Button, ButtonToolbar, Modal, Card, CardHeader, CardBody, CardFooter} from "reactstrap";

class MaBoSSFormulaForm extends React.Component {

	render() {
		return (
			<Modal isOpen={this.props.status} toggle={() => {this.props.toggle()}}>
				<form>
					<Card>
						<CardHeader>Editing formula</CardHeader>
						<CardBody></CardBody>
						<CardFooter>
							<ButtonToolbar className="d-flex">
								<Button color="danger" className="mr-auto" onClick={() => {this.props.toggle();}}>Close</Button>
								<Button type="submit" color="default" className="ml-auto">Submit</Button>
							</ButtonToolbar>
						</CardFooter>
					</Card>
				</form>
			</Modal>
		);
	}
}

export default MaBoSSFormulaForm;
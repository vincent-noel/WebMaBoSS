import React from "react";
import {Button} from "reactstrap";

import ProfilePage from "../ProfilePage";
import MaBoSSServers from "./MaBoSSServers";
import TableMaBoSSServers from "./TableMaBoSSServers";
import MaBoSSServerForm from "./MaBoSSServerForm";
import {getProject} from "../../commons/sessionVariables";

class MaBoSSSettings extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showServerForm: false,
			idServerForm: null
		};

		this.showServerForm = this.showServerForm.bind(this);
		this.hideServerForm = this.hideServerForm.bind(this);

		this.serversAPIEndpoint = "/api/maboss/servers/"
	}

	showServerForm(idServer=null) {
		this.setState({
			showServerForm: true,
			idServerForm: idServer
		})
	}

	hideServerForm() {
		this.setState({
			showServerForm: false,
			idServerForm: null
		})
	}


	render() {
		return <ProfilePage
			path={this.props.match.path}
		>
			<h2>MaBoSS servers</h2>
			<MaBoSSServers endpoint={this.serversAPIEndpoint}
					render={
						(data, updateServers) => {
							return <React.Fragment>
								<TableMaBoSSServers
									data={data}
									updateServers={updateServers}
									edit={this.showServerForm}
									endpoint={this.serversAPIEndpoint}
								/>
								<Button type="button" color="primary" onClick={() => {this.showServerForm(null);}}>
									New server
								</Button>
								<MaBoSSServerForm
									endpoint={this.serversAPIEndpoint}
									id={this.state.idServerForm}
									status={this.state.showServerForm}
									show={this.showServerForm}
									hide={this.hideServerForm}
									updateServers={updateServers}
								/>
							</React.Fragment>
						}
					}
					/>
		</ProfilePage>
	}
}

export default MaBoSSSettings;
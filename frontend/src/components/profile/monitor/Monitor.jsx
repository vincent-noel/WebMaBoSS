import React from "react";

import ProfilePage from "../ProfilePage";
import APICalls from "../../api/apiCalls";
import LoadingIcon from "../../commons/loaders/LoadingIcon";
import ActivityChart from "./ActivityChart";
import StorageStats from "./StorageStats";
import UsersTable from "./UsersTable";
import Cleanup from "./Cleanup";

class Monitor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			admin: null,
			// Incremented after a cleanup, to reload the storage and the users
			version: 0,
		};

		this.isAdminCall = null;
	}

	componentDidMount() {
		this.isAdminCall = APICalls.MonitoringCalls.isAdmin();
		this.isAdminCall.promise.then(admin => this.setState({admin: admin}));
	}

	componentWillUnmount() {
		if (this.isAdminCall !== null) { this.isAdminCall.cancel(); }
	}

	render() {
		let content;
		if (this.state.admin === null) {
			content = <LoadingIcon width="3rem"/>;

		} else if (!this.state.admin) {
			content = <div className="alert alert-danger">This page is only for the administrators.</div>;

		} else {
			content = <React.Fragment>
				<ActivityChart/>
				<StorageStats version={this.state.version}/>
				<UsersTable version={this.state.version}/>
				<Cleanup onCleaned={() => this.setState({version: this.state.version + 1})}/>
			</React.Fragment>;
		}

		return <ProfilePage
			path={this.props.match.path}
		>
			<h2>Monitoring</h2><br/>
			{content}
		</ProfilePage>
	}
}

export default Monitor;

import React from "react";

import ProfilePage from "./ProfilePage";
import {getProject, getUsername} from "../commons/sessionVariables";


class MaBoSSSettings extends React.Component {

	render() {
		return <ProfilePage
			path={this.props.match.path}
			project={getProject()}
		>
			<h2>MaBoSS servers</h2>
		</ProfilePage>
	}
}

export default MaBoSSSettings;
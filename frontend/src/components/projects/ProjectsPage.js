import React from "react";

import FullPage from "../FullPage";
import Projects from "./Projects";
import TableProjects from "./TableProjects";
import isConnected from "../commons/isConnected";

class ProjectsPage extends React.Component {

	componentWillMount() {
		if (!isConnected()) {
			this.props.history.push("/login/");
		}
	}
	render () {
		if (isConnected()) {
			return (
				<FullPage>
					<h2>Projects</h2><br/>

					<Projects endpoint="/api/projects/"
							  render={(data, updateParent) => <TableProjects data={data}
																			 updateParent={updateParent}/>}/>
				</FullPage>
			);
		}
		else return null;

	}
}

export default ProjectsPage;

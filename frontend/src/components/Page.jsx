import React from "react";
import NavBar from "./navbar/NavBar";
import PropTypes from "prop-types";
import {getProject, isConnected} from "./commons/sessionVariables";
import history from './history';
import {ProjectContext} from './context';


class Page extends React.Component {

	static propTypes = {
		path: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			project: getProject()
		};
		this.updateProject = this.updateProject.bind(this);

	}

	updateProject(project) {
		this.setState({project: project});
	}


	componentDidMount() {
		if (!isConnected() && this.props.path !== "/register/") {
			history.push("/login/");
		}
	}

	render() {
		return (
			<ProjectContext.Provider value={{project: this.state.project, updateProject: this.updateProject}}>
			<div className="container-fluid">
				<NavBar path={this.props.path}/>
				<div className="page">
					{this.props.children}
				</div>
			</div>
			</ProjectContext.Provider>
		);
	}
}

export default Page;
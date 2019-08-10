import React from "react";
import {NavLink} from "react-router-dom";
import {setProject, getProject} from "../commons/sessionVariables";
import APICalls from "../api/apiCalls";
import LoadingIcon from "../commons/loaders/LoadingIcon";

class ProjectDropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			projects: [],
			projectName: ""
		};

		this.onProjectChanged = this.onProjectChanged.bind(this);

		this.getProjectCall = null;
	}

	getProjects() {
		this.getProjectCall = APICalls.ProjectCalls.getProjects();
		this.getProjectCall.promise.then((projects) => {
			this.setState({ projects: projects, loaded: true });
			if (getProject() !== null && getProject() !== undefined) {
				for (const project in projects) {
					if (projects[project].id === getProject()) {
						this.setState({projectName: projects[project].name});
						break;
					}
				}
			} else {
				if (projects.length > 0){
					setProject(projects[0].id);
					this.setState({projectName: projects[0].name});
					this.props.updateProject(projects[0].id);
				}
			}
		});

	}

	componentDidMount(){
		this.getProjects();
	}

	componentWillUnmount(){
		this.getProjectCall.cancel();
	}

	onProjectChanged(project_id, name) {
		setProject(project_id);
		this.setState({projectName: name});
		this.props.updateProject(project_id);
	}

	render() {

		if (!this.state.loaded) {
			return <LoadingIcon width="1rem" dark/>;

		} else {
			if (this.state.projects.length > 0) {
				return (

					<div className="dropdown" align="center">
						<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
								data-toggle="dropdown"
								aria-haspopup="true" aria-expanded="false" style={{width: '15rem'}}>
							{this.state.projectName}
						</button>
						<div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton" style={{width: '15rem'}}>
							{this.state.projects.map((project, id) => {
								return <NavLink
									to={this.props.path}
									className="dropdown-item bg-dark" key={project.id}
									onClick={(e) => this.onProjectChanged(project.id, project.name)}>{project.name}
								</NavLink>

							})}
						</div>
					</div>
				);
			} else {
				return null;
			}
		}
	}
}

export default ProjectDropdown;

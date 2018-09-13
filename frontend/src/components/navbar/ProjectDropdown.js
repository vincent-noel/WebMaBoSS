import React from "react";
import {NavLink} from "react-router-dom";
import {setProject, getProject, getAPIKey} from "../commons/sessionVariables";
import {getProjects} from "../commons/apiCalls";
import LoadingIcon from "../commons/LoadingIcon";

class ProjectDropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			projects: [],
			projectName: ""
		};

		this.onProjectChanged = this.onProjectChanged.bind(this);
		this.getProjects = this.getProjects.bind(this);
	}

	getProjects() {
		getProjects((projects) => {
			this.setState({ projects: projects, loaded: true });
			if (getProject() !== null) {
				for (const project in projects) {
					if (projects[project].id === parseInt(getProject())) {
						this.setState({projectName: projects[project].name});
						break;
					}
				}
			} else {
				if (projects.length > 0){
					setProject(projects[0].id);
					this.setState({projectName: projects[0].name});
				}
			}
		});

	}

	componentDidMount(){
		this.getProjects();

	}

	onProjectChanged(project_id, name) {
		setProject(project_id);
		this.setState({projectName: name});
		this.props.updateProject(project_id);
	}

	render() {

		if (!this.state.loaded) {
			return <LoadingIcon width="5rem"/>;

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

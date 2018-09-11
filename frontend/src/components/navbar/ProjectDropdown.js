import React from "react";
import {NavLink} from "react-router-dom";
import {setProject, getProject, getAPIKey} from "../commons/sessionVariables";

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
		fetch(
			"/api/projects/",
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => response.json())
		.then(data => {
			this.setState({ projects: data, loaded: true });
			if (getProject() !== null) {
				for (const project in data) {
					if (data[project].id === parseInt(getProject())) {
						this.setState({projectName: data[project].name});
						break;
					}
				}
			} else {
				if (data.length > 0){
					setProject(data[0].id);
					this.setState({projectName: data[0].name});
				}
			}
		});
	}

	componentDidMount(){
		this.getProjects();

	}

	onProjectChanged(project_id, name) {
		console.log("Switching to project " + project_id + " : " + name);
		setProject(project_id);
		console.log("New project : " + getProject());
		this.setState({projectName: name});

		this.props.updateProject();
	}

	render() {

		if (!this.state.loaded) {
			return  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" width="20px"/>;

		} else {
			if (this.state.projects.length > 0) {
				return (

					<div className="dropdown container-fluid">
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

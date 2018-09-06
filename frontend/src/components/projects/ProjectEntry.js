import React, { Component } from "react";
import {NavLink} from "react-router-dom";
import {ButtonToolbar} from "reactstrap";
import EditButton from "../commons/buttons/EditButton";
import DeleteButton from "../commons/buttons/DeleteButton";
// import DownloadButton from "../commons/DownloadButton";
import {setProject} from "../commons/sessionVariables";

class ProjectEntry extends Component {
  render() {
    return <tr>
        <td>
            <NavLink to="/models/" onClick={() => {setProject(this.props.entry.id);}}>{this.props.entry["name"]}</NavLink>
        </td>
        <td>
            <ButtonToolbar className="justify-content-end">
                {/*<DownloadProject url={this.props.entry.file} />*/}
                <EditButton endpoint="/api/projects/" update={this.props.updateProjects} id={this.props.entry.id} edit={this.props.edit}/>
                <DeleteButton endpoint="/api/projects/" update={this.props.updateProjects} id={this.props.entry.id}/>
            </ButtonToolbar>
        </td>
    </tr>;
  }
}
export default ProjectEntry;
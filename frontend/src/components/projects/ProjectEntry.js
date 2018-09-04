import React, { Component } from "react";
import DeleteForm from "./DeleteForm";
import DownloadProject from "./DownloadProject";
import {NavLink} from "react-router-dom";


class ProjectEntry extends Component {

  render() {
    return <tr>
        <td>
            <NavLink to="/models/" onClick={sessionStorage.setItem('project', this.props.entry.id)}>{this.props.entry["name"]} </NavLink>
        </td>
        {/*<DownloadProject url={this.props.entry.file} />*/}
        <DeleteForm endpoint="/api/projects/" updateParent={this.props.updateParent} id={this.props.entry.id}/>
    </tr>;
  }
}
export default ProjectEntry;
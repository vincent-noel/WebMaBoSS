import React, { Component } from "react";
import DeleteModelForm from "./DeleteModelForm";
import DownloadModel from "./DownloadModel";
import {NavLink} from "react-router-dom";


class LogicalModelEntry extends Component {

  render() {
    return <tr>
        <td>
            <NavLink to={"/model/" + this.props.entry["id"] + "/"}>{this.props.entry["name"]}</NavLink>
        </td>
        <DownloadModel url={this.props.entry.file} />
        <DeleteModelForm endpoint="/api/logical_models/" updateParent={this.props.updateParent} id={this.props.entry.id}/>
    </tr>;
  }
}
export default LogicalModelEntry;
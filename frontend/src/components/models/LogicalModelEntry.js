import React, { Component } from "react";
import {NavLink} from "react-router-dom";
import {ButtonToolbar} from "reactstrap";
import DownloadButton from "../commons/buttons/DownloadButton";
import DeleteButton from "../commons/buttons/DeleteButton";
import EditButton from "../commons/buttons/EditButton";
import {getProject, setModel} from "../commons/sessionVariables";

class LogicalModelEntry extends Component {

  render() {

    return <tr>
        <td>
            <NavLink to={"/model/"} onClick={() => {setModel(this.props.entry.id)}}>{this.props.entry.name}</NavLink>
        </td>
        <td>
            <ButtonToolbar className="justify-content-end">
                <EditButton

                    endpoint={"/api/logical_models/" + this.props.project + "/"}
                    id={this.props.entry.id}
                    edit={this.props.edit}
                    update={this.props.updateParent}
                />
                <DownloadButton
                    endpoint={"/api/logical_models/" + this.props.project + "/"}
                    filename={this.props.entry.file.split("/").pop()}
                    id={this.props.entry.id}
                />
                <DeleteButton
                    endpoint={"/api/logical_models/" + this.props.project + "/"}
                    update={this.props.updateParent}
                    id={this.props.entry.id}
                />
            </ButtonToolbar>
        </td>
    </tr>;
  }
}
export default LogicalModelEntry;
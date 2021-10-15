import React, { Component } from "react";
import {NavLink} from "react-router-dom";
import {ButtonToolbar} from "reactstrap";
import DownloadButton from "../commons/buttons/DownloadButton";
import DeleteButton from "../commons/buttons/DeleteButton";
import EditButton from "../commons/buttons/EditButton";
import {isConnected, setModel} from "../commons/sessionVariables";
import TagButton from "../commons/buttons/TagButton";

class LogicalModelEntry extends Component {

  render() {

    return <tr>
        <td>
            <NavLink to={"/model/overview/"} onClick={() => {setModel(this.props.entry.id)}}>{this.props.entry.name}</NavLink>
        </td>
        <td>
            <ButtonToolbar className="justify-content-end">
                {isConnected() ? <EditButton
                    endpoint={"/api/logical_models/" + this.props.project + "/"}
                    id={this.props.entry.id}
                    edit={this.props.edit}
                    update={this.props.updateParent}
                    title={"Edit model's name"}
                /> : null }
                {/* <TagButton project={this.props.project} id={this.props.entry.id} tag={this.props.tag}/> */}
                <DownloadButton
                    onClick={() => this.props.download(this.props.entry.id)}
                    title={"Export model"}
                />
                { isConnected() ? <DeleteButton
                    endpoint={"/api/logical_models/" + this.props.project + "/"}
                    update={this.props.updateParent}
                    id={this.props.entry.id}
                    title={"Delete model"}
                /> : null }
            </ButtonToolbar>
        </td>
    </tr>;
  }
}
export default LogicalModelEntry;
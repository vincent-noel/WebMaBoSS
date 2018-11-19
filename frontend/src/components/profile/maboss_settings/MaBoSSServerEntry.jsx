import React, { Component } from "react";
import {ButtonToolbar} from "reactstrap";
import EditButton from "../../commons/buttons/EditButton";
import DeleteButton from "../../commons/buttons/DeleteButton";

class MaBoSSServerEntry extends Component {
  render() {
    return <tr>
        <td>{this.props.entry["host"] + ":" + this.props.entry["port"]}</td>
        <td>
            <ButtonToolbar className="justify-content-end">
                <EditButton endpoint={this.props.endpoint} update={this.props.updateServers} id={this.props.entry.id} edit={this.props.edit}/>
                <DeleteButton endpoint={this.props.endpoint} update={this.props.updateServers} id={this.props.entry.id}/>
            </ButtonToolbar>
        </td>
    </tr>;
  }
}
export default MaBoSSServerEntry;
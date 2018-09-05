import React, { Component } from "react";
import getCSRFToken from "../commons/getCSRFToken";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class DeleteForm extends Component {


  handleSubmit = e => {
	e.preventDefault();

	const conf = {
	  method: "delete",
	  headers: new Headers({
		'Authorization': "Token " + sessionStorage.getItem("api_key"),
	  })
	};

	fetch(this.props.endpoint + this.props.id, conf)
	.then(response => { this.props.updateParent();});
  };
  render() {
  	const style_td_min = {'width': '1%', 'whiteSpace': 'nowrap'};
	return (
		<td style={style_td_min}>
		<form onSubmit={this.handleSubmit}>
		  <div className="control">
			<button type="submit" className="btn btn-danger">
				<FontAwesomeIcon icon={faTrash} size="sm" />
			</button>
		  </div>
		</form>
		</td>
	);
  }
}
export default DeleteForm;
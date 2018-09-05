import React, { Component } from "react";
import getCSRFToken from "../commons/getCSRFToken";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class DeleteModelForm extends Component {


  handleSubmit = e => {
	e.preventDefault();


	const formData = new FormData();
	formData.append('project', sessionStorage.getItem('project'));
	formData.append('id',this.props.id);

	const conf = {
	  method: "delete",
	  body: formData,
	  headers: new Headers({
		'Authorization': "Token " + sessionStorage.getItem("api_key"),
		'X-CSRFToken': getCSRFToken()
	  })
	};

	fetch(this.props.endpoint + sessionStorage.getItem('project') + "/" + this.props.id, conf)
		.then(response => {
			console.log(response);
			this.props.updateParent();
		});
  };
  render() {
  	const style_td_min = {'width': '1%', 'whiteSpace': 'nowrap'};
	return (
		<td style={style_td_min}>
		<form onSubmit={this.handleSubmit}>
		  <div className="control">
			<button type="submit" className="btn btn-danger">
				<FontAwesomeIcon icon={faTrash} />
			</button>
		  </div>
		</form>
		</td>
	);
  }
}
export default DeleteModelForm;
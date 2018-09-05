import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { saveAs} from "file-saver/FileSaver";


class DownloadModel extends Component {

	constructor(props) {
		super(props);

		this.download.bind(this);

	}


	download() {
		const filename = this.props.url.split('/').slice(-1);

		fetch(
			"/api/logical_models/" + sessionStorage.getItem('project') + "/" + this.props.id,
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + sessionStorage.getItem("api_key")
				}),
			}
		)
		.then(response => {

			return response.blob();
		})
		.then(blob => saveAs(blob, filename));
	}

  render() {
	const style_td_min = {'width': '1%', 'whiteSpace': 'nowrap'};
	return (
		<td style={style_td_min}>
		  <a onClick={() => {this.download();}}>
			<button type="button" className="btn btn-info">
				<FontAwesomeIcon icon={faSave} />
			</button>
		  </a>
		</td>
	);
  }
}
export default DownloadModel;
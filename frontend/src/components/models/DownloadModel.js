import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faSave } from '@fortawesome/free-solid-svg-icons';

class DownloadModel extends Component {

  render() {
	const style_td_min = {'width': '1%', 'whiteSpace': 'nowrap'};
	return (
		<td style={style_td_min}>
		  <a href={this.props.url}>
			<button type="button" className="btn btn-info">
				<FontAwesomeIcon icon={faSave} />
			</button>
		  </a>
		</td>
	);
  }
}
export default DownloadModel;
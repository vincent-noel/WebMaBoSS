import React, {Component} from "react";
import PropTypes from "prop-types";
import MaBoSSServerEntry from "./MaBoSSServerEntry";


class TableMaBoSSServers extends Component {

	static propTypes = {
		data: PropTypes.array.isRequired
	};

	render() {

		return !this.props.data.length ? (
			null
	  	) : (
			<div>
				<div className="column">
				  <table className="table table-striped">
					<thead>
					  <tr>
						  <th>Name</th>
						  <th></th>
					  </tr>
					</thead>
					<tbody>
					  {this.props.data.map(el => (
						<MaBoSSServerEntry
							key={el.id} entry={el}
							endpoint={this.props.endpoint}
							updateServers={this.props.updateServers}
							edit={this.props.edit}/>
					  ))}
					</tbody>
				  </table>
				</div>
			</div>
		);
	}
}

export default TableMaBoSSServers;
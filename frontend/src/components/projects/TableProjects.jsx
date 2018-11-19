import React, {Component} from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import ProjectEntry from "./ProjectEntry";


class TableProjects extends Component {

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
						<ProjectEntry key={el.id} entry={el} updateProjects={this.props.updateProjects} edit={this.props.edit}/>
					  ))}
					</tbody>
				  </table>
				</div>
			</div>
		);
	}
}

export default TableProjects;
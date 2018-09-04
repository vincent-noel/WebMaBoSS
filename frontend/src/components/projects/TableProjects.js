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
						{/*{Object.entries(this.props.data[0]).map(el => <th key={key(el)}>{el[0]}</th>)}*/}
						<th></th>
					  </tr>
					</thead>
					<tbody>
					  {this.props.data.map(el => (
						<ProjectEntry key={el.id} entry={el} updateParent={this.props.updateParent}/>
					  ))}
					</tbody>
				  </table>
				</div>
			</div>
		);
	}
}

export default TableProjects;
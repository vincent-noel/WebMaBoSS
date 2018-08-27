import React, {Component} from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import LogicalModelEntry from "./LogicalModelEntry";


class TableModels extends Component {

	static propTypes = {
		data: PropTypes.array.isRequired
	};

	render() {

		return !this.props.data.length ? (
			<div>
				<p>Nothing to show</p>
			</div>
	  	) : (
			<div>
				<div className="column">
				  <h2 className="subtitle">
					Showing <strong>{this.props.data.length} items</strong>
				  </h2>
				  <table className="table table-striped">
					<thead>
					  <tr>
						  <th>Name</th>
						{/*{Object.entries(this.props.data[0]).map(el => <th key={key(el)}>{el[0]}</th>)}*/}
						<th></th><th></th>
					  </tr>
					</thead>
					<tbody>
					  {this.props.data.map(el => (
						<LogicalModelEntry key={el.id} entry={el} updateParent={this.props.updateParent}/>
					  ))}
					</tbody>
				  </table>
				</div>
			</div>
		);
	}
}

export default TableModels;
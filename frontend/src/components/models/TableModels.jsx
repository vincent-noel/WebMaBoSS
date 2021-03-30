import React, {Component} from "react";
import PropTypes from "prop-types";
import LogicalModelEntry from "./LogicalModelEntry";


class TableModels extends Component {

	static propTypes = {
		data: PropTypes.array.isRequired
	};

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.project !== this.props.project) {
			this.props.updateParent();
		}
		return true;
	}

	render() {

		return !this.props.data.length ? (
			<div>
				<p>Nothing to show</p>
			</div>
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
						<LogicalModelEntry
							project={this.props.project}
							key={el.id} entry={el}
							updateParent={this.props.updateParent}
							edit={this.props.edit}
							download={this.props.download}
							tag={this.props.tag}
						/>
					  ))}
					</tbody>
				  </table>
				</div>
			</div>
		);
	}
}

export default TableModels;
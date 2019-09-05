import React from "react";
import LoadingIcon from "./loaders/LoadingIcon";
import Switch from "./buttons/Switch";
import Switch3Pos from "./buttons/Switch3Pos";
import Range from "./buttons/Range";

class TableSwitches extends React.Component {

	render() {
		if (Object.keys(this.props.dict).length > 0) {
			return <div className="container" style={{overflow: 'auto', height: (this.props.height !== undefined) ? this.props.height : "20rem"}}>
				<table className="table table-striped" style={{width: '100%'}}>
					<tbody>
					{
						Object.keys(this.props.dict).map((key, index) => {
							return <tr key={index}>
								<td onClick={() => this.props.toggle(key)}>{key}</td>
								<td className="d-flex justify-content-end">
									{ (() => {
											switch(this.props.type) {

												case '3pos' :
													return <Switch3Pos
														id={this.props.id + "-" + key}
														updateCallback={(value) => {this.props.updateCallback(key, value)}}
														value={this.props.dict[key]}
													/>;

												case 'switch' :
													return <Switch
														id={this.props.id + "-" + key}
														updateCallback={(value) => {this.props.updateCallback(key, value)}}
														checked={this.props.dict[key]}
													/>;

												case 'range' :
													return <Range
														id={this.props.id + "-" + key}
														updateCallback={(value) => {this.props.updateCallback(key, value)}}
														value={this.props.dict[key]}
													/>;
												default: return null;
											}
										})()
									}

								</td>
							</tr>
						})
					}
					</tbody>
				</table>
			</div>
		} else return <LoadingIcon width="3rem"/>
	}
}

export default TableSwitches;
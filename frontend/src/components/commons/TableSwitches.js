import React from "react";
import LoadingIcon from "../../commons/LoadingIcon";
import Switch from "../../commons/buttons/Switch";
import Switch3Pos from "../../commons/buttons/Switch3Pos";
import Range from "../../commons/buttons/Range";

class TableSwitches extends React.Component {

	render() {
		if (Object.keys(this.props.dict).length > 0) {
			return <div className="container" style={{overflow: 'auto', height: '20rem'}}>
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
														value={(() => {
															switch (JSON.stringify(this.props.dict[key])) {
																case '0':
																	return 'off';

																case '1':
																	return 'on';

																case '[0, 1]':
																	return 'na';

																default:
																	return null;
															}
														})()
														}
													/>;

												case 'switch' :
													return <Switch
														id={this.props.id + "-" + key}
														updateCallback={(value) => {this.props.updateCallback(key, value)}}
														checked={this.props.dict[key]===1}
													/>;

												case 'range' :
													return <Range
														id={this.props.id + "-" + key}
														updateCallback={(value) => {this.props.updateCallback(key, value)}}
														value={this.props.dict[key][1]}
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
		} else return <LoadingIcon width="200px"/>
	}
}

export default TableSwitches;
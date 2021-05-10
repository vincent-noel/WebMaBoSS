import React from "react";
import LoadingIcon from "./loaders/LoadingIcon";
import Switch from "./buttons/Switch";
import Switch3Pos from "./buttons/Switch3Pos";
import Range from "./buttons/Range";
import BufferedRange from "./buttons/BufferedRange";

class TableSwitches extends React.Component {

	render() {
		if (Object.keys(this.props.dict).length > 0) {
			return <div className="container" style={{overflow: 'auto', height: (this.props.height !== undefined) ? this.props.height : "20rem"}}>
				<table className="table table-striped" style={{width: '100%'}}>
					{(this.props.allSwitch !== undefined) ?
						<thead>
							<tr key={"all"}>
								<th style={{borderTop: '0'}}></th>
								<th style={{borderTop: '0'}} className="d-flex justify-content-end">
								{ (() => {
											switch(this.props.type) {

												case '3pos' :
													return <Switch3Pos
														id={this.props.id + "-all"}
														updateCallback={(value) => {this.props.allSwitchToggle(value)}}
														value={this.props.allSwitch}
													/>;

												case 'switch' :
													return <Switch
														id={this.props.id + "-all"}
														toggle={() => {this.props.allSwitchToggle()}}
														checked={this.props.allSwitch}
													/>;

												case 'range' :
													return <Range
														id={this.props.id + "-all"}
														updateCallback={(value) => {this.props.allSwitchToggle(value)}}
														value={this.props.allSwitch}
													/>;
													
												case 'bufferedrange' :
													return <BufferedRange
														value={this.props.allSwitch} id={this.props.id + "-all"}
														updateCallback={(value) => this.props.allSwitchToggle(value)}
														buffer={50} waiting={this.props.allUpdating}
												   	/>;
												
												default: return null;
											}
										})()
									}
								</th>
							</tr>
						</thead> : null}
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
														toggle={() => {this.props.toggleNode(key)}}
														checked={this.props.dict[key]}
													/>;

												case 'range' :
													return <Range
														id={this.props.id + "-" + key}
														updateCallback={(value) => {this.props.updateCallback(key, value)}}
														value={this.props.dict[key]}
													/>;
													
												case 'bufferedrange' :
													return <BufferedRange
														value={this.props.dict[key]} id={this.props.id + "-" + index}
														updateCallback={(value) => this.props.updateCallback(key, value)}
														buffer={50} waiting={this.props.updating[key]}
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
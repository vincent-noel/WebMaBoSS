import React from "react";
import APICalls from "../../../api/apiCalls";
import "./table-nodes.scss";
import MaBoSSNodeFormulas from "./MaBoSSNodeFormulas";
import LoadingIcon from "../../../commons/LoadingIcon";
import UpDownButton from "../../../commons/buttons/UpDownButton";


class MaBoSSNodes extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nodes: [],
			showNodesDetails: []
		};

		this.getNodesCall = null;
	}

	loadNodes(project_id, model_id) {
		this.getNodesCall = APICalls.MaBoSSCalls.getMaBoSSNodes(project_id, model_id);
		this.getNodesCall.promise.then(data => this.setState({
			nodes: data, showNodesDetails: new Array(data.length).fill(false)
		}));

	}

	toggleNodeDetails(index) {
		let array = this.state.showNodesDetails;
		array[index] = !array[index];
		this.setState({showNodesDetails: array});
	}
	componentDidMount() {
		this.loadNodes(this.props.project, this.props.modelId)
	}

	componentWillUnmount() {
		if (this.getNodesCall !== null) {
			this.getNodesCall.cancel();
		}
	}

	render() {

		return (
			<ul className="list-nodes">

					{	this.state.nodes.length > 0 ?
						this.state.nodes.map((name, index) => {
							return <li key={index}>

									<table className="table-nodes">
										<thead>
										<tr className={"d-flex"}>
											<th className={"flex-fill name align-items-center"} colSpan="2">{name}</th>
											<th className={"ml-1 actions d-flex align-items-center"}>
												<UpDownButton
													id={index}
													onClick={() => this.toggleNodeDetails(index)}
													status={this.state.showNodesDetails[index]}
													size={"sm"}/>
											</th>
										</tr>
										</thead>
										<MaBoSSNodeFormulas
											show={this.state.showNodesDetails[index]} name={name}
											project={this.props.project} modelId={this.props.modelId}
										/>
									</table>

							</li>;
						}) :
						<LoadingIcon width="3rem"/>
					}

			</ul>
		);
	}
}

export default MaBoSSNodes;
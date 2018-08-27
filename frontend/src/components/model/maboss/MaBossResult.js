import React from "react";
import MaBossFixedPoints from "./MaBossFixedPoints";
import MaBossNodesProbTraj from "./MaBossNodesProbTraj";


class MaBossResult extends React.Component {

	static colormap = ['#4c72b0', '#55a868', '#c44e52', '#8172b2', '#ccb974', '#64b5cd', '#4c72b0', '#55a868', '#c44e52', '#8172b2'];

	render() {

		return (
			<React.Fragment>
			<ul className="nav nav-tabs">
				<li className="nav-item">
					<a className="nav-link active" data-toggle="tab" href="#fp">Steady states probability</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" data-toggle="tab" href="#npt">Nodes probability trajectories</a>
				</li>
			</ul>
			<div className="tab-content">
				<div className="tab-pane container active" id="fp">
					<MaBossFixedPoints
					modelId={this.props.modelId}
					simulationId={this.props.simulationId}
					colormap={MaBossResult.colormap}
				/>
				</div>
				<div className="tab-pane container fade" id="npt">
					<MaBossNodesProbTraj
					modelId={this.props.modelId}
					simulationId={this.props.simulationId}
					colormap={MaBossResult.colormap}
				/>
				</div>
			</div>
			</React.Fragment>
		);

	}
}

export default MaBossResult;
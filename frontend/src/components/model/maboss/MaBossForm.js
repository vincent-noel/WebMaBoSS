import React from "react";

class MaBossForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			sampleCount: 1000,
			maxTime: 100,
			timeTick: 1,
		};

		this.handleSampleCountChange.bind(this);
		this.handleMaxTimeChange.bind(this);
		this.handleTimeTickChange.bind(this);
	}

	handleSampleCountChange(e) {
		this.setState({sampleCount: e.target.value});
	}

	handleMaxTimeChange(e) {
		this.setState({maxTime: e.target.value});
	}

	handleTimeTickChange(e) {
		this.setState({timeTick: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		this.props.onSubmit({
			sampleCount: this.state.sampleCount,
			maxTime: this.state.maxTime,
			timeTick: this.state.timeTick,
		});
	}


	render() {
		return (
			<React.Fragment>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<div className="form-group row">
						<label htmlFor="sampleCount" className="col-sm-2 col-form-label">Sample count</label>
						<div className="col-sm-10">
							<input type="numbers" className="form-control" id="sampleCount" placeholder="1000"
								   value={this.state.sampleCount} onChange={(e) => this.handleSampleCountChange(e)}
							/>
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="maxTime" className="col-sm-2 col-form-label">Max time</label>
						<div className="col-sm-10">
							<input type="number" className="form-control" id="maxTime" placeholder="100"
								   value={this.state.maxTime} onChange={(e) => this.handleMaxTimeChange(e)}
							/>
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="timeTick" className="col-sm-2 col-form-label">Time tick</label>
						<div className="col-sm-10">
							<input type="number" className="form-control" id="timeTick" placeholder="1"
								   value={this.state.timeTick} onChange={(e) => this.handleTimeTickChange(e)}
							/>
						</div>
					</div>
					<button type="submit" className="btn btn-default">Submit</button>
				</form>
				<br/>
			</React.Fragment>
		);
	}
}

export default MaBossForm;
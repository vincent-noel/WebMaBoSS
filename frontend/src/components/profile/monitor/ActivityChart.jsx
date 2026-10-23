import React from "react";
import {Card, CardHeader, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {Bar} from "react-chartjs-2";
// Registers all the chart types, scales and plugins of Chart.js
import "chart.js/auto";

import APICalls from "../../api/apiCalls";
import LoadingIcon from "../../commons/loaders/LoadingIcon";
import {daysAgo} from "./format";


class ActivityChart extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			start: daysAgo(365),
			end: daysAgo(0),
			period: "week",
			activity: null,
			error: null,
		};

		this.getActivityCall = null;
	}

	getActivity() {
		if (this.getActivityCall !== null) { this.getActivityCall.cancel(); }
		this.setState({activity: null, error: null});

		this.getActivityCall = APICalls.MonitoringCalls.getActivity(this.state.start, this.state.end, this.state.period);
		this.getActivityCall.promise.then(
			activity => this.setState({activity: activity}),
			error => { if (!error.isCanceled) { this.setState({error: "Could not load the activity"}); } }
		);
	}

	componentDidMount() {
		this.getActivity();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.start !== this.state.start || prevState.end !== this.state.end || prevState.period !== this.state.period) {
			if (this.state.start !== "" && this.state.end !== "" && this.state.start <= this.state.end) {
				this.getActivity();
			}
		}
	}

	componentWillUnmount() {
		if (this.getActivityCall !== null) { this.getActivityCall.cancel(); }
	}

	renderChart() {
		if (this.state.error !== null) {
			return <div className="alert alert-danger">{this.state.error}</div>;
		}
		if (this.state.activity === null) {
			return <LoadingIcon width="3rem"/>;
		}

		const activity = this.state.activity;
		const data = {
			labels: activity.periods,
			datasets: [
				{label: "Active users", data: activity.active, backgroundColor: "#007bff"},
				{label: "New users", data: activity.registered, backgroundColor: "#28a745"},
			],
		};
		const options = {
			plugins: {legend: {position: "bottom"}},
			scales: {y: {beginAtZero: true, ticks: {precision: 0}}},
		};
		return <Bar data={data} options={options}/>;
	}

	render() {
		return <Card className="mb-4">
			<CardHeader>Activity</CardHeader>
			<CardBody>
				<Row form>
					<Col md={4}>
						<FormGroup>
							<Label for="activity-start">From</Label>
							<Input id="activity-start" type="date" value={this.state.start} max={this.state.end}
								   onChange={(e) => this.setState({start: e.target.value})}/>
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup>
							<Label for="activity-end">To</Label>
							<Input id="activity-end" type="date" value={this.state.end} min={this.state.start}
								   onChange={(e) => this.setState({end: e.target.value})}/>
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup>
							<Label for="activity-period">Per</Label>
							<Input id="activity-period" type="select" value={this.state.period}
								   onChange={(e) => this.setState({period: e.target.value})}>
								<option value="day">day</option>
								<option value="week">week</option>
								<option value="month">month</option>
							</Input>
						</FormGroup>
					</Col>
				</Row>
				{this.renderChart()}
				<small className="text-muted">
					Users who used WebMaBoSS while logged in. Before this was recorded, the activity is estimated from
					the registrations, the last logins and the creation of simulations and sensitivity analyses.
					Anonymous users are not counted.
				</small>
			</CardBody>
		</Card>;
	}
}

export default ActivityChart;

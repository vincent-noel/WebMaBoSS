import React from "react";
import {Button, Card, CardHeader, CardBody, Col, Row, Table} from "reactstrap";

import APICalls from "../../api/apiCalls";
import LoadingIcon from "../../commons/loaders/LoadingIcon";
import {formatSize} from "./format";


class StorageStats extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			storage: null,
			error: null,
			optimizing: null,
		};

		this.getStorageCall = null;
		this.optimizeCall = null;
	}

	getStorage() {
		if (this.getStorageCall !== null) { this.getStorageCall.cancel(); }
		this.setState({storage: null, error: null});

		this.getStorageCall = APICalls.MonitoringCalls.getStorage();
		this.getStorageCall.promise.then(
			storage => this.setState({storage: storage}),
			error => { if (!error.isCanceled) { this.setState({error: "Could not load the storage"}); } }
		);
	}

	optimize() {
		this.optimizeCall = APICalls.MonitoringCalls.optimizeStorage();
		this.optimizeCall.promise.then(
			response => this.setState({optimizing: response.tables}),
			error => { if (!error.isCanceled) { this.setState({error: "Could not give the free space back"}); } }
		);
	}

	componentDidMount() {
		this.getStorage();
	}

	componentDidUpdate(prevProps) {
		// After a cleanup
		if (prevProps.version !== this.props.version) {
			this.getStorage();
		}
	}

	componentWillUnmount() {
		if (this.getStorageCall !== null) { this.getStorageCall.cancel(); }
		if (this.optimizeCall !== null) { this.optimizeCall.cancel(); }
	}

	renderSummary(title, size, details) {
		return <Col md={4}>
			<Card className="mb-3 text-center">
				<CardBody>
					<h6 className="text-muted">{title}</h6>
					<h3>{size}</h3>
					<small className="text-muted">{details}</small>
				</CardBody>
			</Card>
		</Col>;
	}

	render() {
		let content;
		if (this.state.error !== null) {
			content = <div className="alert alert-danger">{this.state.error}</div>;

		} else if (this.state.storage === null) {
			content = <LoadingIcon width="3rem"/>;

		} else {
			const storage = this.state.storage;
			content = <React.Fragment>
				<Row>
					{this.renderSummary("Database", formatSize(storage.database.size),
						"results of the simulations, accounts, models' names... "
						+ formatSize(storage.database.free) + " free, still held by the database")}
					{this.renderSummary("Data", formatSize(storage.data.size),
						"files of the models and simulations, " + formatSize(storage.data.other) + " outside of the projects")}
					{this.renderSummary("Disk", formatSize(storage.disk.free) + " free",
						"of " + formatSize(storage.disk.size) + ", where the data is")}
				</Row>
				{storage.database.tables.length > 0 ?
					<Table size="sm" hover>
						<thead><tr><th>Table</th><th className="text-right">Rows</th><th className="text-right">Size</th><th className="text-right">Free</th></tr></thead>
						<tbody>
							{storage.database.tables.filter(table => table.size >= 1000000).map(table =>
								<tr key={table.name}>
									<td>{table.name}</td>
									<td className="text-right">{table.rows}</td>
									<td className="text-right">{formatSize(table.size)}</td>
									<td className="text-right">{formatSize(table.free)}</td>
								</tr>
							)}
						</tbody>
					</Table> : null
				}
				<small className="text-muted">Tables of more than 1 MB. The number of rows is an estimate of the database.</small>
				{storage.database.free > 0 ?
					<div className="mt-3">
						<Button color="secondary" onClick={() => this.optimize()} disabled={this.state.optimizing !== null}>
							Give the free space of the database back to the disk
						</Button>
						<div><small className="text-muted">
							{this.state.optimizing === null ?
								"The database keeps the space of what is deleted. Rebuilding its tables gives it back, and can take a few minutes."
								: "Rebuilding " + this.state.optimizing.join(", ") + " in the background : reload later to see the result."
							}
						</small></div>
					</div> : null
				}
			</React.Fragment>;
		}

		return <Card className="mb-4">
			<CardHeader>Storage</CardHeader>
			<CardBody>{content}</CardBody>
		</Card>;
	}
}

export default StorageStats;

import React from "react";
import {Button, Card, CardHeader, CardBody, FormGroup, Input, Label, Table} from "reactstrap";

import APICalls from "../../api/apiCalls";
import LoadingIcon from "../../commons/loaders/LoadingIcon";
import ConfirmationModal from "../../commons/ConfirmationModal";
import {formatSize, formatDate} from "./format";


const KINDS = [
	{
		kind: "old", title: "Old simulations and sensitivity analyses", days: 365, inactiveOnly: true,
		description: "Simulations and sensitivity analyses created before a number of days. The models are kept.",
	},
	{
		kind: "failed", title: "Failed simulations and sensitivity analyses",
		description: "Simulations which failed, or are still queued or running after a day (interrupted by a restart),"
			+ " and sensitivity analyses of which no simulation finished.",
	},
	{
		kind: "demo", title: "Simulations of anonymous users",
		description: "Simulations and sensitivity analyses run on the demo models by anonymous users, more than a day ago.",
	},
	{
		kind: "accounts", title: "Inactive accounts", days: 730,
		description: "Accounts without any visit for a number of days, with all their projects, models and results."
			+ " Administrators are never deleted.",
	},
];


class CleanupAction extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			days: props.days,
			inactiveOnly: props.inactiveOnly,
			preview: null,
			loading: false,
			confirm: false,
			deleting: null,
			error: null,
		};

		this.call = null;
	}

	previewCleanup() {
		if (this.call !== null) { this.call.cancel(); }
		this.setState({preview: null, loading: true, error: null, deleting: null});

		this.call = APICalls.MonitoringCalls.getCleanupPreview(this.props.kind, this.state.days, this.state.inactiveOnly);
		this.call.promise.then(
			preview => this.setState({preview: preview, loading: false}),
			error => { if (!error.isCanceled) { this.setState({error: "Could not preview the cleanup", loading: false}); } }
		);
	}

	// Deletes batch after batch, until nothing is left
	cleanup(deleted = {simulations: 0, analyses: 0, accounts: 0}) {
		this.setState({deleting: deleted});

		this.call = APICalls.MonitoringCalls.cleanup(this.props.kind, this.state.days, this.state.inactiveOnly);
		this.call.promise.then(
			response => {
				const total = {
					simulations: deleted.simulations + response.deleted.simulations,
					analyses: deleted.analyses + response.deleted.analyses,
					accounts: deleted.accounts + response.deleted.accounts,
				};
				const progress = response.deleted.simulations + response.deleted.analyses + response.deleted.accounts;
				if (response.left > 0 && progress > 0) {
					this.cleanup(total);
				} else {
					this.setState({deleting: total, preview: null});
					this.props.onCleaned();
				}
			},
			error => { if (!error.isCanceled) { this.setState({error: "The cleanup stopped with an error", preview: null}); } }
		);
	}

	componentWillUnmount() {
		if (this.call !== null) { this.call.cancel(); }
	}

	changeParameters(values) {
		// The preview is for the previous parameters
		this.setState(Object.assign({preview: null, deleting: null}, values));
	}

	renderPreview() {
		const preview = this.state.preview;
		const nothing = preview.simulations === 0 && preview.analyses === 0 && preview.accounts.length === 0;
		if (nothing) {
			return <p className="mt-3">Nothing to delete.</p>;
		}

		const items = preview.items.map(item =>
			<tr key={item.type + item.id}>
				<td>{item.type}</td><td>{item.name}</td><td>{item.model}</td><td>{item.user}</td><td style={{whiteSpace: "nowrap"}}>{formatDate(item.created_at)}</td>
			</tr>
		);

		return <div className="mt-3">
			<p>
				{this.props.kind === "accounts" ? <React.Fragment><b>{preview.accounts.length}</b> accounts, with </React.Fragment> : null}
				<b>{preview.simulations}</b> simulations and <b>{preview.analyses}</b> sensitivity analyses,
				freeing <b>{formatSize(preview.database)}</b> in the database and <b>{formatSize(preview.data)}</b> of files.
			</p>
			{preview.accounts.length > 0 ?
				<p><small>{preview.accounts.map(account => account.username).join(", ")}</small></p> : null}
			{items.length > 0 ?
				<div style={{maxHeight: "20rem", overflowY: "auto"}}>
					<Table size="sm">
						<thead><tr><th>Type</th><th>Name</th><th>Model</th><th>User</th><th>Created</th></tr></thead>
						<tbody>{items}</tbody>
					</Table>
				</div> : null}
			{preview.simulations > 100 || preview.analyses > 100 ?
				<small className="text-muted">The 100 oldest of each are listed.</small> : null}
			<div className="mt-2">
				<Button color="danger" onClick={() => this.setState({confirm: true})}>Delete</Button>
			</div>
		</div>;
	}

	render() {
		const deleting = this.state.deleting;

		return <Card className="mb-3">
			<CardBody>
				<h5>{this.props.title}</h5>
				<p className="text-muted">{this.props.description}</p>
				<div className="d-flex align-items-end flex-wrap">
					{this.props.days !== undefined ?
						<FormGroup className="mr-3 mb-0">
							<Label for={"cleanup-days-" + this.props.kind}>
								{this.props.kind === "accounts" ? "Without visit for (days)" : "Created more than (days ago)"}
							</Label>
							<Input id={"cleanup-days-" + this.props.kind} type="number" min="1" value={this.state.days}
								   onChange={(e) => this.changeParameters({days: e.target.value})}/>
						</FormGroup> : null}
					{this.props.inactiveOnly !== undefined ?
						<FormGroup check className="mr-3 mb-2">
							<Label check>
								<Input type="checkbox" checked={this.state.inactiveOnly}
									   onChange={(e) => this.changeParameters({inactiveOnly: e.target.checked})}/>
								Only of the users without visit since then
							</Label>
						</FormGroup> : null}
					<Button color="primary" onClick={() => this.previewCleanup()}
							disabled={this.props.days !== undefined && !(parseInt(this.state.days) >= 1)}>
						Preview
					</Button>
				</div>

				{this.state.error !== null ? <div className="alert alert-danger mt-3">{this.state.error}</div> : null}
				{this.state.loading ? <LoadingIcon width="2rem"/> : null}
				{this.state.preview !== null && deleting === null ? this.renderPreview() : null}
				{deleting !== null ?
					<p className="mt-3">
						{this.state.preview === null ? "Deleted " : "Deleting... "}
						{deleting.simulations} simulations, {deleting.analyses} sensitivity analyses
						{this.props.kind === "accounts" ? ", " + deleting.accounts + " accounts" : null}.
					</p> : null}
			</CardBody>

			<ConfirmationModal
				status={this.state.confirm}
				message={"Delete them ? It can't be undone."}
				yes={() => { this.setState({confirm: false}); this.cleanup(); }}
				no={() => this.setState({confirm: false})}
			/>
		</Card>;
	}
}


class Cleanup extends React.Component {

	render() {
		return <Card className="mb-4">
			<CardHeader>Cleanup</CardHeader>
			<CardBody>
				{KINDS.map(kind =>
					<CleanupAction key={kind.kind} {...kind} onCleaned={this.props.onCleaned}/>
				)}
				<small className="text-muted">
					The database keeps the space of what is deleted : give it back to the disk in the storage section.
				</small>
			</CardBody>
		</Card>;
	}
}

export default Cleanup;

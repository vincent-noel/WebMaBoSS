import React from "react";

import APICalls from "../../../api/apiCalls";
import LoadingIcon from "../../../commons/loaders/LoadingIcon";
import SimpleEditButton from "../../../commons/buttons/SimpleEditButton";
import MaBoSSSettingsForm from "./MaBoSSSettingsForm";

import "./table-settings.scss";

class MaBoSSSettings extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			settings: {},

			showValueForm: false,
			settingValueForm: null,
			valueValueForm: "",
		};

		this.getSettingsCall = null;
		this.updateSettingsCall = null;

		this.toggleValueForm = this.toggleValueForm.bind(this);
		this.editSettings = this.editSettings.bind(this);
		this.updateSettingValue = this.updateSettingValue.bind(this);
	}

	toggleValueForm() {
		this.setState({showValueForm: !this.state.showValueForm});
	}

	editSettings(name) {
		this.setState({
			showValueForm: true,
			settingValueForm: name,
			valueValueForm: this.state.settings[name],
		})
	}


	loadSettings(project_id, model_id) {
		this.getSettingsCall = APICalls.MaBoSSCalls.getMaBoSSModelSettings(project_id, model_id);
		this.getSettingsCall.promise.then(response => {
			this.setState({settings: response.settings})
		});
	}

	updateSettingValue(name, value) {

		const settings = this.state.settings;
		settings[name] = value;

		this.updateSettingsCall = APICalls.MaBoSSCalls.updateMaBoSSModelSettings(
			this.props.project, this.props.modelId, settings
		);
		this.updateSettingsCall.promise.then(response => {
			if (response.status === 200){
				this.setState({settings: settings, showValueForm: false, settingValueForm: null, valueValueForm: ""});
			}
		});
	}

	componentDidMount() {
		this.loadSettings(this.props.project, this.props.modelId);
	}

	componentWillUnmount() {
		if (this.getSettingsCall !== null) {
			this.getSettingsCall.cancel();
		}

		if (this.updateSettingsCall !== null) {
			this.updateSettingsCall.cancel();
		}
	}

	render() {

		return (
			<React.Fragment>
				<ul className="list-settings">
				{
					this.state.settings !== null ?
					Object.keys(this.state.settings).map((name, index) => {
						return (
							<li key={index}>
								<table className="table-settings">
									<thead>
									<tr className={"d-flex"}>
										<th className={"flex-fill name align-items-center"}>{name}</th>
										<th className={"value d-flex align-items-center"}>{this.state.settings[name]}</th>
										<th className={"ml-1 actions d-flex align-items-center"}>
											<SimpleEditButton onClick={() => this.editSettings(name) } size={"sm"}/>
										</th>
									</tr>
									</thead>
								</table>
							</li>
						);
					}) :
					<LoadingIcon width="3rem"/>
				}
				</ul>
				<MaBoSSSettingsForm
					status={this.state.showValueForm} toggle={this.toggleValueForm}
					submit={this.updateSettingValue}
					name={this.state.settingValueForm} value={this.state.valueValueForm}
					{...this.props}
				/>
			</React.Fragment>
		);
	}
}

export default MaBoSSSettings;
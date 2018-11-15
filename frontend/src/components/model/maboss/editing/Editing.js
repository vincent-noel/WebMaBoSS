import React from "react";
import {Nav, NavItem, NavLink, TabPane, TabContent} from "reactstrap";
import classnames from 'classnames';

import ModelPage from "../../ModelPage";
import ModelName from "../../ModelName";
import MaBoSSNodes from "./MaBoSSNodes";
import MaBoSSParameters from "./MaBoSSParameters";

import {ProjectContext, ModelContext} from "../../../context";
import ErrorAlert from "../../../commons/ErrorAlert";


class Editing extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			activeTab: 'formulas',
			errorMessages: []
		};

		this.showErrorMessages = this.showErrorMessages.bind(this);
	}

	toggleTab(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({activeTab: tab });
    	}
	}

	showErrorMessages(errorMessages) {
		this.setState({errorMessages: errorMessages});
	}

	render() {

		return (
			<ModelPage
				path={this.props.match.path}
			>
				<ProjectContext.Consumer>
					{(projectContext => <ModelContext.Consumer>
						{(modelContext => <React.Fragment>
								<ModelName
									modelName={modelContext.modelName}
								/>

								<ErrorAlert errorMessages={this.state.errorMessages}/>
								<Nav tabs>
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.activeTab === 'formulas' })}
											onClick={() => { this.toggleTab('formulas'); }}
										>Rates</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.activeTab === 'parameters' })}
											onClick={() => { this.toggleTab('parameters'); }}
										>Parameters</NavLink>
									</NavItem>
								</Nav>
								<br/>
								<TabContent activeTab={this.state.activeTab}>
									<TabPane tabId="formulas">
										<MaBoSSNodes
											project={projectContext.project}
											modelId={modelContext.modelId}
											onModelChanged={modelContext.onModelChanged}
										/>
									</TabPane>
									<TabPane tabId="parameters">
										<MaBoSSParameters
											project={projectContext.project}
											modelId={modelContext.modelId}
											onModelChanged={modelContext.onModelChanged}
											showErrorMessages={this.showErrorMessages}
										/>

									</TabPane>
								</TabContent>
							</React.Fragment>
						)}
						</ModelContext.Consumer>
					)}
				</ProjectContext.Consumer>
			</ModelPage>
		);
	}
}

export default Editing;
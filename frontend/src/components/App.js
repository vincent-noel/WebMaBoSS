import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.min';
import '../scss/custom.scss';
import '../images/favicon.ico';
import React, {Component} from "react";
import {Router, Route} from "react-router-dom";

import history from './history';

import Profile from "./profile/Profile";
import SignIn from "./auth/SignIn";
import SignOut from "./auth/SignOut";
import Register from "./auth/Register";


import ProjectsPage from "./projects/ProjectsPage";
import Models from "./models/Models";
import Data from "./Data";
import {OverviewWrapper, Overview_v2Wrapper} from "./model/overview/OverviewWrapper";
import {SteadyStatesWrapper} from "./model/steady_states/SteadyStatesWrapper";
import {MaBoSSSimulationWrapper} from "./model/maboss/simulation/MaBoSSSimulationWrapper";
import MaBossEditing from "./model/maboss/editing/Editing";
import MaBoSSSettings from "./profile/maboss_settings/MaBoSSSettings";

class App extends Component {

	render(){
		return (
			<Router history={history}>
				<React.Fragment>
					<Route exact path="/" component={ProjectsPage} />

					<Route exact path="/login/" component={SignIn} />
					<Route exact path="/logout/" component={SignOut} />
					<Route exact path="/register/" component={Register} />

					<Route exact path="/models/" component={Models} />
					<Route exact path="/data/" component={Data} />

					<Route exact path="/model/overview/" component={OverviewWrapper} />
					<Route exact path="/model/overview_v2/" component={Overview_v2Wrapper} />
					<Route exact path="/model/fixed_points/" component={SteadyStatesWrapper} />
					<Route exact path="/model/maboss/simulation/" component={MaBoSSSimulationWrapper} />
					<Route exact path="/model/maboss/editing/" component={MaBossEditing} />

					<Route exact path="/profile/account/" component={Profile} />
					<Route exact path="/profile/maboss/" component={MaBoSSSettings} />

				</React.Fragment>
			</Router>
		)
	}
}

export default App;
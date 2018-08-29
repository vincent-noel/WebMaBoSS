import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import '../scss/custom.scss';

import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Index from "./Index";

import SignIn from "./auth/SignIn";
import SignOut from "./auth/SignOut";
import Register from "./auth/Register";

import Models from "./models/Models";
import Data from "./Data";
import Overview from "./model/overview/Overview";
import ModelSteadyStates from "./model/steady_states/ModelSteadyStates";
import MaBoss from "./model/maboss/MaBoss";


class App extends Component {

	render(){
		return (
			<Router>
				<React.Fragment>
					<Route exact path="/" component={Index} />

					<Route exact path="/login/" component={SignIn} />
					<Route exact path="/logout/" component={SignOut} />
					<Route exact path="/profile/" component={Index} />
					<Route exact path="/register/" component={Register} />

					<Route path="/models/" component={Models} />
					<Route path="/data/" component={Data} />

					<Route exact path="/model/:modelId/" component={Overview} />
					<Route path="/model/:modelId/steady_states/" component={ModelSteadyStates} />
					<Route path="/model/:modelId/maboss/" component={MaBoss} />
				</React.Fragment>
			</Router>
		)
	}
}

export default App;
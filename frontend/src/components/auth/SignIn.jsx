import React from "react";
import {Card, CardHeader, CardBody} from "reactstrap";
import history from '../history';

import FullPage from "../FullPage";
import ErrorAlert from "../commons/ErrorAlert";
import {isConnected, setAPIKey, setUser} from "../commons/sessionVariables";
import APICalls from "../api/apiCalls";
import MaBoSSIcon from "../commons/MaBoSSIcon";


class SignIn extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			username: "",
			usernameHasError: false,
			password: "",
			passwordHasError: false,
			errorMessages: [],
		};

		this.handleSubmit.bind(this);
		this.handleUsernameChange.bind(this);
		this.handlePasswordChange.bind(this);
		this.loginCall = null;
	}

	handleSubmit(e) {

		e.preventDefault();

		this.loginCall = APICalls.AuthCalls.login(this.state.username, this.state.password);
		this.loginCall.promise.then(json_response => {

			this.setState({
				usernameHasError: false,
				passwordHasError: false,
				errorMessages: [],
			});

			if ('key' in json_response) {
				setAPIKey(json_response['key']);
				setUser(this.state.username);
				history.push("/");

			} else if ('username' in json_response || 'password' in json_response) {

				let new_state = {};
				let errorMessages = [];

				if ('username' in json_response) {
					new_state.usernameHasError = true;
					errorMessages.push(json_response['username']);
				}
				if ('password' in json_response) {
					new_state.passwordHasError = true;
					errorMessages.push(json_response['password']);
				}

				new_state.errorMessages = errorMessages;
				this.setState(new_state);

			} else if ('non_field_errors' in json_response) {

				let errorMessages = this.state.errorMessages;
				errorMessages.push(json_response['non_field_errors']);
				this.setState({errorMessages: errorMessages});
			}

		});

	}

	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	componentDidMount() {
		if (isConnected()) {
			history.push("/");
		}
	}

	componentWillUnmount() {
		if (this.loginCall !== null) this.loginCall.cancel();
	}

	render(){
		return <FullPage path={this.props.match.path}>
				<div className="d-flex justify-content-center">
					<form onSubmit={(e) => this.handleSubmit(e)} id="form_login">
					<Card style={{width: '20em'}}>
						<CardHeader>Sign in</CardHeader>
						<CardBody>
							<div className="d-flex justify-content-center">
								<MaBoSSIcon width={"200px"}/>
							</div>
						<br/>
						<ErrorAlert errorMessages={this.state.errorMessages}/>
							<div className="form-group">
								<label htmlFor="username">Username</label>
								<input
									id="username"
									className={"form-control" + (this.state.usernameHasError?" is-invalid":"")}
									type="text"
									name="username"
									onChange={(e) => this.handleUsernameChange(e)}
									value={this.state.username}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input
									id="password"
									className={"form-control" + (this.state.passwordHasError?" is-invalid":"")}
									type="password"
									name="password"
									onChange={(e) => this.handlePasswordChange(e)}
									value={this.state.password}
									required
								/>
							</div>
							<div>
								<button type="submit" className="btn btn-primary" id="submit_login">
									Sign in
								</button>
							</div>
						</CardBody>
					</Card>
					</form>
				</div>
		</FullPage>;
	}
}

export default SignIn;
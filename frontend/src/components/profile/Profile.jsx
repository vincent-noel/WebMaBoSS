import React from "react";
import {Button, ButtonToolbar, Card, CardBody, CardFooter} from "reactstrap";

import ProfilePage from "./ProfilePage";
import APICalls from "../api/apiCalls";
import ErrorAlert from "../commons/ErrorAlert";
import SuccessAlert from "../commons/SuccessAlert";


class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			originalEmail: "",
			oldpassword: "",
			password1: "",
			password2: "",
			errorPassword: [],
			successPassword: [],
		};

		this.changePasswordCall = null;
		this.getEmailCall = null;
		this.changeEmailCall = null;

		this.saveChangePassword = this.saveChangePassword.bind(this);
		this.saveChangeEmail = this.saveChangeEmail.bind(this);
	}

	handleEmailChange(e) {
		this.setState({email: e.target.value});
	}

	handleOldPasswordChange(e) {
		this.setState({oldpassword: e.target.value});
	}

	handlePassword1Change(e) {
		this.setState({password1: e.target.value});
	}

	handlePassword2Change(e) {
		this.setState({password2: e.target.value});
	}

	saveChangeEmail() {

		if (this.state.email !== this.state.originalEmail) {
			this.changeEmailCall = APICalls.AuthCalls.changeEmail(this.state.email);
			this.changeEmailCall.promise.then(
				response => {
					console.log(response);
					this.setState({originalEmail: this.state.email})
				}
			);
		}
	}


	saveChangePassword() {

		if (this.state.oldpassword !== "" && this.state.password1 !== "" && this.state.password1 === this.state.password2) {

			this.changePasswordCall = APICalls.AuthCalls.changePassword(this.state.oldpassword, this.state.password1, this.state.password2);
			this.changePasswordCall.promise.then(
				response => {
					let errors = [];
					let successes = [];
					if ('old_password' in response){
						errors = errors.concat(response['old_password']);
					}

					if ('new_password2' in response) {
						errors = errors.concat(response['new_password2']);
					}

					if ('detail' in response) {
						successes = successes.concat(response['detail']);
					}

					console.log(successes)

					if (errors.length > 0) {
						this.setState({errorPassword: errors, successPassword: successes});

					} else {
						this.setState({oldpassword: "",password1: "", password2: "", errorPassword: errors, successPassword: successes});
					}
				}
			);
		}
	}
	getEmail() {
		this.getEmailCall = APICalls.AuthCalls.getEmail();
		this.getEmailCall.promise.then(
			response => {
				this.setState({email: response.email, originalEmail: response.email})
			}
		);
	}

	componentDidMount() {
		this.getEmail();
	}

	componentWillUnmount() {
		if (this.changePasswordCall !== null) { this.changePasswordCall.cancel(); }
		if (this.getEmailCall !== null) { this.getEmailCall.cancel(); }
		if (this.changeEmailCall !== null) { this.changeEmailCall.cancel(); }
	}

	render() {
		return <ProfilePage
			path={this.props.match.path}
		>
			<h2>Account settings</h2><br/>
			<Card>
				<CardBody>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							className="form-control"
							type="text"
							name="email"
							onChange={(e) => this.handleEmailChange(e)}
							value={this.state.email}

						/>
					</div>
				</CardBody>
				<CardFooter>
					<ButtonToolbar className="d-flex">
						<Button type="submit" color="primary" className="ml-auto" onClick={this.saveChangeEmail}>Save</Button>
					</ButtonToolbar>
				</CardFooter>
			</Card>
			<br/>
			<Card>
				<CardBody>
					<ErrorAlert errorMessages={this.state.errorPassword}/>
					<SuccessAlert messages={this.state.successPassword}/>
					<div className="form-group">
						<label htmlFor="oldpassword">Old Password</label>
						<input
							id="oldpassword"
							className="form-control"
							type="password"
							name="oldpassword"
							onChange={(e) => this.handleOldPasswordChange(e)}
							value={this.state.oldpassword}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password1">New Password</label>
						<input
							id="password1"
							className="form-control"
							type="password"
							name="password1"
							onChange={(e) => this.handlePassword1Change(e)}
							value={this.state.password1}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password2">New Password confirmation</label>
						<input
							id="password2"
							className="form-control"
							type="password"
							name="password2"
							onChange={(e) => this.handlePassword2Change(e)}
							value={this.state.password2}
						/>
					</div>
				</CardBody>
				<CardFooter>
					<ButtonToolbar className="d-flex">
						<Button type="submit" color="primary" className="ml-auto" onClick={this.saveChangePassword}>Save</Button>
					</ButtonToolbar>
				</CardFooter>
			</Card>
		</ProfilePage>;
	}
}

export default Profile;
import React from "react";
import Page from "../Page";
import getCSRFToken from "../commons/getCSRFToken";
import ErrorAlert from "../commons/ErrorAlert";


class Register extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			username: "",
			usernameHasError: false,
			email: "",
			emailHasError: false,
			password1: "",
			password1HasError: false,
			password2: "",
			errorMessages: []
		};

		this.handleSubmit.bind(this);
		this.handleUsernameChange.bind(this);
		this.handleEmailChange.bind(this);
		this.handlePassword1Change.bind(this);
		this.handlePassword2Change.bind(this);
	}

	handleSubmit(e) {

		e.preventDefault();

		const formData = new FormData();
		formData.append('username', this.state.username);
		formData.append('email', this.state.email);
		formData.append('password1', this.state.password1);
		formData.append('password2', this.state.password2);

		const conf = {
		  method: "post",
		  body: formData,
		  headers: new Headers({
			  'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/register/", conf)
		.then(response => response.json())
		.then(json_response => {

			this.state = {
				usernameHasError: false,
				emailHasError: false,
				password1HasError: false,
				errorMessages: []
			};

			if ('key' in json_response) {
				sessionStorage.setItem("api_key", json_response['key']);
				this.props.history.push("/");

			} else if (
				'email' in json_response || 'username' in json_response	|| 'password1' in json_response
			) {

				let new_state = {};
				let errorMessages = [];

				if ('username' in json_response) {
					new_state.usernameHasError = true;
					errorMessages.push(json_response['username']);
				}

				if ('email' in json_response) {
					new_state.emailHasError = true;
					errorMessages.push(json_response['email']);
				}

				if ('password1' in json_response) {
					new_state.password1HasError = true;
					errorMessages.push(json_response['password1']);
				}

				new_state.errorMessages = errorMessages;
				this.setState(new_state);

			} else if ('non_field_error' in json_response) {

				let errorMessages = this.state.errorMessages;
				errorMessages.push(json_response['non_field_errors']);
				this.setState({errorMessages: errorMessages});
			}

		});

	}

	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handleEmailChange(e) {
		this.setState({email: e.target.value});
	}

	handlePassword1Change(e) {
		this.setState({password1: e.target.value});
	}

	handlePassword2Change(e) {
		this.setState({password2: e.target.value});
	}

	render(){

		return <Page>
			<div className="container">
				<br/>
				<form onSubmit={(e) => this.handleSubmit(e)}>
				<div className="card">
					<div className="card-header">
						Register to App-Curie
					</div>
					<div className="card-body">
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
							<div className="form-group">
								<label htmlFor="email">E-mail</label>
								<input
									id="email"
									className={"form-control" + (this.state.emailHasError?" is-invalid":"")}
									type="text"
									name="email"
									onChange={(e) => this.handleEmailChange(e)}
									value={this.state.email}
									required
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="password1">Password</label>
							<input
								id="password1"
								className={"form-control" + (this.state.password1HasError?" is-invalid":"")}
								type="password"
								name="password1"
								onChange={(e) => this.handlePassword1Change(e)}
								value={this.state.password1}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password2">Confirm password</label>
							<input
								id="password2"
								className={"form-control" + (this.state.password1HasError?" is-invalid":"")}
								type="password"
								name="password2"
								onChange={(e) => this.handlePassword2Change(e)}
								value={this.state.password2}
								required
							/>
						</div>
						<div>
							<button type="submit" className="btn btn-primary">
								Register
							</button>
						</div>
					</div>
				</div>
			</form>
			</div>
		</Page>;
	}
}

export default Register;
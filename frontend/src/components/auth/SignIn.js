import React from "react";
import Page from "../Page";
import getCSRFToken from "../commons/getCSRFToken";
import { Redirect } from 'react-router-dom';


class SignIn extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			username: "",
			email: "",
			password: ""
		};

		this.responseStatus = undefined;
		this.responseMessage = "";

		this.handleSubmit.bind(this);
		this.handleUsernameChange.bind(this);
		this.handleEmailChange.bind(this);
		this.handlePasswordChange.bind(this);
	}

	handleSubmit(e) {

		e.preventDefault();

		const formData = new FormData();
		formData.append('username', this.state.username);
		formData.append('email', this.state.email);
		formData.append('password', this.state.password);


		const conf = {
		  method: "post",
		  body: formData,
		  headers: new Headers({
			  'X-CSRFToken': getCSRFToken()
		  })
		};

		fetch("/api/login/", conf)
		.then(response => {

			this.responseStatus = response.status;
			return response.json();
		})
		.then(json_response => {

			if ('key' in json_response) {
				sessionStorage.setItem("api_key", json_response['key']);
				this.props.history.push("/");

			} else if ('email' in json_response || 'username' in json_response || 'password' in json_response) {


			} else if ('non_field_error' in json_response) {
				this.errorMessage = json_response['non_field_error'];
			}

		});

	}

	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handleEmailChange(e) {
		this.setState({email: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	render(){

		return <Page>
			<div className="container">
				<br/>
				<form onSubmit={(e) => this.handleSubmit(e)}>
				<div className="card">
					<div className="card-header">
						Sign in
					</div>
					<div className="card-body">
						{/*<div className="form-group">*/}
							{/*<label htmlFor="username">Username</label>*/}
							{/*<input*/}
								{/*id="username"*/}
								{/*className="form-control"*/}
								{/*type="text"*/}
								{/*name="username"*/}
								{/*onChange={(e) => this.handleUsernameChange(e)}*/}
								{/*value={this.state.username}*/}
								{/*required*/}
							{/*/>*/}
						{/*</div>*/}
						<div className="form-group">
							<div className="form-group">
								<label htmlFor="email">E-mail</label>
								<input
									id="email"
									className="form-control"
									type="text"
									name="email"
									onChange={(e) => this.handleEmailChange(e)}
									value={this.state.email}
									required
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="username">Password</label>
							<input
								id="password"
								className="form-control"
								type="password"
								name="password"
								onChange={(e) => this.handlePasswordChange(e)}
								value={this.state.password}
								required
							/>
						</div>
						<div>
							<button type="submit" className="btn btn-primary">
								Sign in
							</button>
						</div>
					</div>
				</div>
			</form>
			</div>
		</Page>;
	}
}

export default SignIn;
import {checkAuthorization, makeCancelable, getDefaultHeaders} from "./commons";

class AuthCalls {

	static login(username, password) {

		const formData = new FormData();
		formData.append('username', username);
		formData.append('password', password);

		return makeCancelable(
			fetch(
				"/api/auth/login",
				{
				  method: "post",
				  body: formData
				}
			)
			.then(response => response.json())
		)
	}

	static logout() {
		return makeCancelable(
			fetch(
				"/api/auth/logout",
				{
					method: "post",
				}
			).then(response => checkAuthorization(response))
		)
	}

	static register(username, email, password1, password2) {

		const formData = new FormData();
		formData.append('username', username);
		formData.append('email', email);
		formData.append('password1', password1);
		formData.append('password2', password2);

		return makeCancelable(
			fetch(
				"/api/auth/register",
				{
				  method: "post",
				  body: formData,
				}
			).then(response => checkAuthorization(response)
			).then(response => response.json())
		)
	}

	static changePassword(password1, password2) {

		const formData = new FormData();
		formData.append('password1', password1);
		formData.append('password2', password2);

		return makeCancelable(
			fetch(
				"/api/auth/register",
				{
				  	method: "post",
				 	body: formData,
					headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response)
			).then(response => response.json())
		)
	}

	static getEmail() {

		return makeCancelable(
			fetch(
				"/api/auth/email",
				{
				  	method: "get",
				 	headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response)
			).then(response => response.json())
		)
	}

	static changeEmail(email) {

		const formData = new FormData();
		formData.append('email', email);

		return makeCancelable(
			fetch(
				"/api/auth/email",
				{
				  	method: "put",
					body: formData,
				 	headers: getDefaultHeaders()
				}
			).then(response => checkAuthorization(response)
			).then(response => response.json())
		)
	}
}
export default AuthCalls;
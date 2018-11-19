import React from "react";

class ErrorAlert extends React.Component {

	render() {

		if (this.props.errorMessages.length > 0) {
			return (
				<div className="alert alert-danger" role="alert">
					{this.props.errorMessages.map((message, index) => {
						return (
							<React.Fragment key={index}>
								{message}
								{ (index < (this.props.errorMessages.length-1)) ? <br/> : null }
							</React.Fragment>
						)
					})}
				</div>
			);
		} else return null;
	}
}

export default ErrorAlert;

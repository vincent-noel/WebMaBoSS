import React from "react";

class SuccessAlert extends React.Component {

	render() {

		if (this.props.messages.length > 0) {
			return (
				<div className="alert alert-success" role="alert">
					{this.props.messages.map((message, index) => {
						return (
							<React.Fragment key={index}>
								{message}
								{ (index < (this.props.messages.length-1)) ? <br/> : null }
							</React.Fragment>
						)
					})}
				</div>
			);
		} else return null;
	}
}

export default SuccessAlert;

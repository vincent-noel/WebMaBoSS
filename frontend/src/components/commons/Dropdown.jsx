import React from "react";

class Dropdown extends React.Component {

	render() {

		return <div className="dropdown" align="center">
			<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
					data-toggle="dropdown"
					aria-haspopup="true" aria-expanded="false" style={{width: this.props.width}}>
				{this.props.selectedItem}
			</button>
			<div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton" style={{width: this.props.width}}>
				{React.Children.map(
					this.props.children,
					child => React.cloneElement(child, {
						className: "dropdown-item bg-dark active",
					})
				)}
			</div>
		</div>;
	}
}

export default Dropdown;
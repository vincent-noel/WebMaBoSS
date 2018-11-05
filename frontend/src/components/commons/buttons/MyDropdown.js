import React from "react";
import {NavLink} from "react-router-dom";
import LoadingIcon from "../LoadingIcon";


class MyDropdown extends React.Component {

	render() {

		if (!this.props.loaded) {
			return <LoadingIcon width="1rem" />;

		} else {

			return (
				<div className="dropdown" align="center">
					<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
							data-toggle="dropdown"
							aria-haspopup="true" aria-expanded="false" style={{width: this.props.width}}>
						{this.props.values[this.props.value]}
					</button>
					<div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton" style={{width: this.props.width}}>
						{Object.keys(this.props.values).map((value, id) => {
							return <a
								href={"#"}
								className="dropdown-item bg-dark active" key={id}
								onClick={(e) => { e.preventDefault(); this.props.onItemSelected(value)}}>{this.props.values[value]}
							</a>

						})}
					</div>
				</div>
			);
		}
	}
}

export default MyDropdown;

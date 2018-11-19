import React from "react";

import SideBar from "./SideBar";
import MenuPage from "../MenuPage";
import PropTypes from "prop-types";

class ProfilePage extends React.Component {

	static propTypes = {
		path: PropTypes.string.isRequired,
	};

	render() {
		return <MenuPage path={this.props.path}
			sidebar={<SideBar path={this.props.path}/>}
		>
			{this.props.children}
		</MenuPage>;
	}
}

export default ProfilePage;
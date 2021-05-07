import React from "react";

import '../../images/maboss_logo.jpg';

class MaBoSSIcon extends React.Component {

	render() {

		return <div align="center">
			<img
				src={"/static/images/maboss_logo.jpg"}
				style={{width: this.props.width}} />
		</div>;
	}
}

export default MaBoSSIcon;
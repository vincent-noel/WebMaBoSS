import React from "react";

import '../../images/loading.svg';
import '../../images/loading_dark.svg';

class LoadingIcon extends React.Component {

	render() {

		const src = this.props.dark !== undefined ? "/static/images/loading_dark.svg" : "/static/images/loading.svg";
		return <div align="center">
			<img
				src={src}
				style={{width: this.props.width}} />
		</div>;
	}
}

export default LoadingIcon;
import React from "react";

import '../../../images/loading.svg';
import '../../../images/loading_dark.svg';

class LoadingInlineIcon extends React.Component {

	render() {

		const src = this.props.dark !== undefined ? "/static/images/loading_dark.svg" : "/static/images/loading.svg";
		return <span align="center" className="d-inline-flex">
			<img
				src={src}
				className="align-items-center"
				style={{width: this.props.width}} />
		</span>;
	}
}

export default LoadingInlineIcon;
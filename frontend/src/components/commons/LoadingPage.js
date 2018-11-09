import React from "react";

import './loading-page.scss';
import '../../images/loading.svg';
import '../../images/loading_dark.svg';

class LoadingPage extends React.Component {

	render() {

		const src = this.props.dark !== undefined ? "/static/images/loading_dark.svg" : "/static/images/loading.svg";
		return <div className="loading-page">
			<img src={src} />
		</div>;
	}
}

export default LoadingPage;
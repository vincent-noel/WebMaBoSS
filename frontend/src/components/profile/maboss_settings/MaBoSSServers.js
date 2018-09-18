import React from "react";
import {getAPIKey} from "../../commons/sessionVariables";
import LoadingIcon from "../../commons/LoadingIcon";


class MaBoSSServers extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			loaded: false,
		};

		this.updateServers = this.updateServers.bind(this);
	}

	updateServers(){
		fetch(
			this.props.endpoint,
			{
				method: "get",
				headers: new Headers({
					'Authorization': "Token " + getAPIKey()
				})
			}
		)
		.then(response => {
			if (response.status !== 200) {
				return this.setState({ placeholder: "Something went wrong" });
			}
			return response.json();
		})
		.then(data => this.setState({ data: data, loaded: true }));
	}

	componentDidMount() {
		this.updateServers();
	}

	render() {
		if (this.state.loaded) {
			return this.props.render(this.state.data, this.updateServers);

		} else {
			return <LoadingIcon width="3rem"/>
		}
	}
}
export default MaBoSSServers;
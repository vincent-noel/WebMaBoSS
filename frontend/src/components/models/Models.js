import React from "react";
import FullPage from "../FullPage";
import LogicalModels from "./LogicalModels";
import TableModels from "./TableModels";

class Models extends React.Component {
	render () {
		return (
			<FullPage>
				<h2>Models</h2><hr/><br/>
				<LogicalModels endpoint="/api/logical_models/"
					render={(data, updateParent) => <TableModels data={data} updateParent={updateParent} />} />
			</FullPage>
		)
	}
}

export default Models;

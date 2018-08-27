import React from "react";

import Page from "../Page";
import LogicalModels from "./LogicalModels";
import TableModels from "./TableModels";

class Models extends React.Component {
	render () {
		return (
			<Page>
				<LogicalModels endpoint="/api/logical_models/"
					render={(data, updateParent) => <TableModels data={data} updateParent={updateParent} />} />
			</Page>
		)
	}
}

export default Models;

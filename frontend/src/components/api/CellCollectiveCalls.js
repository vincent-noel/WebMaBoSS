import {checkAuthorization, makeCancelable, getDefaultHeaders, extractFilename} from "./commons";
import FileSaver from "file-saver";

class CellCollectiveCalls {


	static getCellCollectiveList(from_model, to_model) {

		return makeCancelable(
			fetch(
				"https://research.cellcollective.org/_api/model/get",
				{
					method: "get",
				}
			).then(response => response.json())
		);
	}
	
	static getSBMLURLFromCC(model_id) {
		return "https://research.cellcollective.org/_api/model/export/" + model_id.toString() + "?version=1&type=SBML"
	}
	
	static downloadSBMLFromCC(model_id) {
		return makeCancelable(
			fetch(
				this.getSBMLURLFromCC(model_id),
				{
					method: "get",
				}
			).then(response => Promise.all([
				response.blob()])
			).then(([blob]) => FileSaver.saveAs(blob, model_id.toString() + ".sbml"))
		);
	}

}
export default CellCollectiveCalls;
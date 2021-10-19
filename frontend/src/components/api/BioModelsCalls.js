import {checkAuthorization, makeCancelable, getDefaultHeaders, extractFilename} from "./commons";
import FileSaver from "file-saver";

class BioModelsCalls {

	
	static getBioModelsList() {

		return makeCancelable(
			fetch(
				"/api/biomodels/all",
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => response.json())
		);
	}
	
	static getSBMLURLFromBioModels(model_id) {
		return "https://www.ebi.ac.uk/biomodels/search/download?models=" + model_id;
	}
	
	static downloadSBMLFromBioModels(model_id) {
		return makeCancelable(
			fetch(
				this.getSBMLURLFromBioModels(model_id),
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => Promise.all([
				response.blob()])
			).then(([blob]) => FileSaver.saveAs(blob, model_id.toString() + ".zip"))
		);
	}

}
export default BioModelsCalls;
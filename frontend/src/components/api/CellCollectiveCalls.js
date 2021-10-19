import {checkAuthorization, makeCancelable, getDefaultHeaders, extractFilename} from "./commons";
import FileSaver from "file-saver";

class CellCollectiveCalls {

	
	static getCellCollectiveCount() {
		
		return makeCancelable(
			fetch(
				"https://research.cellcollective.org/_api/model/cards/count/research?modelTypes=boolean",
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => response.json())
		);
	}

	static getCellCollectiveList() {

		return makeCancelable(
			fetch(
				"/api/ccapi/all",
				{
					method: "get",
					headers: getDefaultHeaders()
				}
			).then(response => response.json())
		);
	}
	
	static getCellCollectiveAll(count) {

		return makeCancelable(
			fetch(
				"https://research.cellcollective.org/api/model/cards/research?category=published&orderBy=recent&modelTypes=boolean&cards=" + count,
				{
					method: "get",
					// headers: {
					// 	"Content-Type": "text/plain;charset=UTF-8",
					// 	"Cache-Control": "no-cache",
					// 	"Pragma": "no-cache"
					// },
					// headers: { "Access-Control-Allow-Origin": "*"},
					referrerPolicy: "unsafe-url",//"origin",//no-referrer-when-downgrade",
					headers: getDefaultHeaders()
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
					headers: getDefaultHeaders()
				}
			).then(response => Promise.all([
				response.blob()])
			).then(([blob]) => FileSaver.saveAs(blob, model_id.toString() + ".sbml"))
		);
	}

}
export default CellCollectiveCalls;
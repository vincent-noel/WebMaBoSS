import React from "react";
import Loadable from "react-loadable";
import LoadingPage from "../../../commons/LoadingPage";


const MaBoSSSimulationWrapper = Loadable({
	loader: () => import("./MaBoss"),
	loading: () => <LoadingPage width="5rem"/>
});


export {MaBoSSSimulationWrapper};
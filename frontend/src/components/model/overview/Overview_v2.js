import React from "react";
import Loadable from "react-loadable";
import LoadingPage from "../../commons/LoadingPage";


const Overview_v2 = Loadable({
	loader: () => import("./Overview_v2Raw"),
	loading: () => <LoadingPage width="5rem"/>
});

export default Overview_v2;
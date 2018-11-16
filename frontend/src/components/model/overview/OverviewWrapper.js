import React from "react";
import Loadable from "react-loadable";
import LoadingPage from "../../commons/loaders/LoadingPage";


const Overview_v2Wrapper = Loadable({
	loader: () => import("./Overview_v2"),
	loading: () => <LoadingPage width="5rem"/>
});

const OverviewWrapper = Loadable({
	loader: () => import("./Overview"),
	loading: () => <LoadingPage width="5rem"/>
});


export {OverviewWrapper, Overview_v2Wrapper};
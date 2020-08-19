import React from "react";
import loadable from "@loadable/component";
import LoadingPage from "../../commons/loaders/LoadingPage";


const Overview_v2Wrapper = loadable(
	() => import("./Overview_v2"),
	{fallback: <LoadingPage width="5rem"/>}
);

const OverviewWrapper = loadable(
	() => import("./Overview"),
	{fallback: <LoadingPage width="5rem"/>}
);


export {OverviewWrapper, Overview_v2Wrapper};
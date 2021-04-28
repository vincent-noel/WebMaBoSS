import React from "react";
import loadable from "@loadable/component";
import LoadingPage from "../../commons/loaders/LoadingPage";


const OverviewWrapper = loadable(
	() => import("./Overview"),
	{fallback: <LoadingPage width="5rem"/>}
);

export {OverviewWrapper};
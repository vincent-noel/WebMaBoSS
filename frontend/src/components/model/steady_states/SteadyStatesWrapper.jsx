import React from "react";
import loadable from "@loadable/component";
import LoadingPage from "../../commons/loaders/LoadingPage";


const SteadyStatesWrapper = loadable(
	() => import("./ModelSteadyStates"),
	{fallback: <LoadingPage width="5rem"/>}
);


export {SteadyStatesWrapper};
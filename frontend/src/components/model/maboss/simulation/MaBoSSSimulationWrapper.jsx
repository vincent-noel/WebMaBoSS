import React from "react";
import loadable from "@loadable/component";
import LoadingPage from "../../../commons/loaders/LoadingPage";


const MaBoSSSimulationWrapper = loadable(
	() => import("./MaBoss"), 
	{ fallback: <LoadingPage width="5rem"/> }
);

export {MaBoSSSimulationWrapper};
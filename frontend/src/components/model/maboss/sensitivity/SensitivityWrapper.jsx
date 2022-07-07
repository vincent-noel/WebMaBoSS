import React from "react";
import loadable from "@loadable/component";
import LoadingPage from "../../../commons/loaders/LoadingPage";


const SensitivityWrapper = loadable(
	() => import("./Sensitivity"), 
	{ fallback: <LoadingPage width="5rem"/> }
);

export {SensitivityWrapper};
import React from "react";
import loadable from "@loadable/component";
import LoadingPage from "../../../commons/loaders/LoadingPage";


const EditingWrapper = loadable(
	() => import("./Editing"), 
	{ fallback: <LoadingPage width="5rem"/> }
);

export {EditingWrapper};
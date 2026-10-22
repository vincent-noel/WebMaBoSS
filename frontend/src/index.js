import App from "./components/App";
import { createRoot } from "react-dom/client";
import React from "react";


const wrapper = document.getElementById("app");

wrapper ? createRoot(wrapper).render(<App />) : null;

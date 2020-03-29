import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import config from "./auth_config.json";

//import App from "./App";

import { App } from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();

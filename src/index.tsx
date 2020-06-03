import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";
import { Router } from "react-router";

//import App from "./App";

import { App } from "./App";
import { TaskCard } from "./reusable-ui/TaskCard";
import { Task } from "./types";
import routes from "./components/routes";
import { Route } from "react-router-dom";
import { DesignLook } from "./pages/design";

const onRedirectCallback = (appState: { targetUrl: string }) => {
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

const AppWithLogin = () => {
	return (
		<Auth0Provider
			domain={config.domain}
			client_id={config.clientId}
			redirect_uri={window.location.origin}
			onRedirectCallback={onRedirectCallback}
			cacheLocation={"localstorage"}
		>
			<App />
		</Auth0Provider>
	);
};
/*<App/>
<TasksGraph style={stylesX} width={1000} height={1000} />*/
const stylesX = {
	width: "100%",
	height: "100%",
};
ReactDOM.render(
	<Router history={history}>
		<Route path="/" exact component={AppWithLogin} />
		<Route path="/design" exact component={DesignLook} />
	</Router>,
	document.getElementById("root")
);
/*<Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>, */
serviceWorker.unregister();

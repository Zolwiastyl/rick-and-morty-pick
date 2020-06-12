import "./index.css";

import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Route } from "react-router-dom";

import { App } from "./App";
import config from "./auth_config.json";
import { DesignLook } from "./pages/design";
import { LandingPage } from "./pages/landingPage";
import { Auth0Provider } from "./react-auth0-spa";
import * as serviceWorker from "./serviceWorker";
import history from "./utils/history";

const onRedirectCallback = (appState: { targetUrl: string }) => {
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

const AppWithLogin = () => {
	return (
		<Fragment>
			<Auth0Provider
				domain={config.domain}
				client_id={config.clientId}
				redirect_uri={window.location.origin}
				onRedirectCallback={onRedirectCallback}
				cacheLocation={"localstorage"}
			>
				<App />
			</Auth0Provider>
		</Fragment>
	);
};

ReactDOM.render(
	<Router history={history}>
		<Route path="/" exact component={LandingPage} />
		<Route path="/app" exact component={AppWithLogin} />
		<Route path="/design" exact component={DesignLook} />
	</Router>,
	document.getElementById("root")
);

serviceWorker.unregister();

import "./tailwind.generated.css";

import { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Route } from "react-router-dom";

import { App } from "./App";
import config from "./auth_config.json";
import { Auth0Provider } from "./react-auth0-spa";
import * as serviceWorker from "./serviceWorker";
import history from "./utils/history";
import { DesignLook } from "./views/design";
import { LandingPage } from "./views/landingPage";

const onRedirectCallback = (appState: { targetUrl: string }) => {
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

const auth0Options: Auth0ClientOptions = {
	domain: config.domain,
	client_id: config.clientId,
	redirect_uri: window.location.origin,
	cacheLocation: "localstorage",
};

const AppWithLogin = () => {
	return (
		<Fragment>
			<Auth0Provider
				onRedirectCallback={onRedirectCallback}
				options={auth0Options}
			>
				<App />
			</Auth0Provider>
		</Fragment>
	);
};

ReactDOM.render(
	<Auth0Provider
		onRedirectCallback={onRedirectCallback}
		options={auth0Options}
	>
		<Router history={history}>
			<Route path="/" exact component={LandingPage} />
			<Route path="/app" exact component={AppWithLogin} />
			<Route path="/design" exact component={DesignLook} />
		</Router>
	</Auth0Provider>,
	document.getElementById("root")
);

serviceWorker.unregister();

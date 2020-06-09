import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";
import { Router } from "react-router";
import { App } from "./App";
import { Route } from "react-router-dom";
import { DesignLook } from "./pages/design";
import { LandingPage } from "./pages/landingPage";

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

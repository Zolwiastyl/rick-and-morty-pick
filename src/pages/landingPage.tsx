import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { Fragment } from "react";
import { LogIn, LogOut } from "react-feather";

import config from "../auth_config.json";
import { Auth0Provider, useAuth0 } from "../react-auth0-spa";
import { Button } from "../reusable-ui/Button";
import { NavigationBar } from "../reusable-ui/NavigationBar";
import history from "../utils/history";

const onRedirectCallback = (appState: { targetUrl: string }) => {
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

const redirectOption: RedirectLoginOptions = {
	redirect_uri: window.location.origin + "/app",
};

export const LandingPage = () => {
	const LogInButton = ({ ...children }) => {
		const { isAuthenticated, client } = useAuth0();
		return (
			<Fragment>
				{!isAuthenticated && (
					<Button
						onClick={(evt) => client?.loginWithRedirect(redirectOption)}
						icon={<LogIn />}
					/>
				)}

				{isAuthenticated && (
					<Button onClick={(evt) => client?.logout()} icon={<LogOut />} />
				)}
			</Fragment>
		);
	};
	console.log(window.location.origin);
	return (
		<Auth0Provider
			domain={config.domain}
			client_id={config.clientId}
			redirect_uri={window.location.origin + "/app"}
			onRedirectCallback={onRedirectCallback}
			cacheLocation={"localstorage"}
		>
			<div className="flex flex-col md:flex-row md:flex">
				<NavigationBar>
					<LogInButton />
				</NavigationBar>
				<div> landing page and else</div>
			</div>
		</Auth0Provider>
	);
};

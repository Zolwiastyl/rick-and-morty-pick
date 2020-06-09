import React, { Fragment } from "react";
import { NavigationBar } from "../reusable-ui/NavigationBar";
import { Auth0NavBar } from "../components/NavBar";
import { Auth0Provider, useAuth0 } from "../react-auth0-spa";
import config from "../auth_config.json";
import history from "../utils/history";
import { Button } from "../reusable-ui/Button";
import { LogIn, Link, LogOut } from "react-feather";
import { Route } from "react-router-dom";

const onRedirectCallback = (appState: { targetUrl: string }) => {
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

export const LandingPage = () => {
	const LogInButton = ({ ...children }) => {
		const { isAuthenticated, client } = useAuth0();
		return (
			<Fragment>
				{!isAuthenticated && (
					<Button
						onClick={(evt) => client?.loginWithRedirect({})}
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
			<div>
				{" "}
				landing page and else
				<NavigationBar>
					<LogInButton />
				</NavigationBar>
			</div>
		</Auth0Provider>
	);
};

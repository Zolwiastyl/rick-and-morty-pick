import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { Fragment, useEffect } from "react";
import { LogIn, LogOut } from "react-feather";

import { useAuth0 } from "../react-auth0-spa";
import { IconButton } from "../reusable-ui/IconButton";
import { NavigationBar } from "../reusable-ui/NavigationBar";

const redirectOption: RedirectLoginOptions = {
	redirect_uri: window.location.origin + "/app",
};

export const LandingPage = () => {
	const LogInButton = ({ ...children }) => {
		const { isAuthenticated, client } = useAuth0();
		useEffect(() => {
			client?.isAuthenticated();
		}, [client]);
		return (
			<Fragment>
				{!isAuthenticated && (
					<IconButton
						onClick={(evt) => client?.loginWithRedirect(redirectOption)}
						icon={LogIn}
					/>
				)}

				{isAuthenticated && (
					<IconButton onClick={(evt) => client?.logout()} icon={LogOut} />
				)}
			</Fragment>
		);
	};

	return (
		<div className="flex flex-col md:flex-row md:flex">
			<NavigationBar>
				<LogInButton />
			</NavigationBar>
			<div> landing page and else</div>
		</div>
	);
};

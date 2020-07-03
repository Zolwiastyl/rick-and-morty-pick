import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { Fragment, useEffect } from "react";
import { LogIn, LogOut } from "react-feather";

import { useAuth0 } from "../react-auth0-spa";
import { IconButton } from "../reusable-ui/IconButton";
import { NavigationBar } from "../reusable-ui/NavigationBar";

const redirectOption: RedirectLoginOptions = {
	redirect_uri: window.location.origin + "/app",
};

export const LandingPage: React.FC = () => {
	const LogInButton = ({ ...children }) => {
		const { isAuthenticated, client } = useAuth0();
		useEffect(() => {
			client?.isAuthenticated();
		}, [client]);
		return (
			<Fragment>
				{!isAuthenticated && (
					<IconButton
						onClick={() => {
							client?.loginWithRedirect(redirectOption);
							console.log("clicked");
						}}
						Icon={LogIn}
					/>
				)}

				{isAuthenticated && (
					<IconButton onClick={() => client?.logout()} Icon={LogOut} />
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

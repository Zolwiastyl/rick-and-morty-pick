import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { Fragment } from "react";
import { LogIn, LogOut } from "react-feather";

import { useAuth0 } from "../react-auth0-spa";
import { Button } from "../reusable-ui/Button";
import { NavigationBar } from "../reusable-ui/NavigationBar";

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
		<div className="flex flex-col md:flex-row md:flex">
			<NavigationBar>
				<LogInButton />
			</NavigationBar>
			<div> landing page and else</div>
		</div>
	);
};

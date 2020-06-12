import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import { renderIcon } from "../api/api";
import { LogOut, LogIn, User, Home } from "react-feather";
import { Button } from "../reusable-ui/Button";
import { RedirectLoginOptions } from "@auth0/auth0-spa-js/dist/typings/global";

export const Auth0NavBar = () => {
	const { isAuthenticated, client } = useAuth0();

	const redirectOptions: RedirectLoginOptions = {
		redirect_uri: window.location.origin + "/app",
	};

	return (
		<Fragment>
			{!isAuthenticated && (
				<Button
					onClick={(evt) => client?.loginWithRedirect({})}
					icon={renderIcon(LogIn)}
				/>
			)}

			{isAuthenticated && (
				<Button
					onClick={(evt) =>
						client?.logout({
							returnTo: window.location.origin + "/",
						})
					}
					icon={renderIcon(LogOut)}
				/>
			)}
			{isAuthenticated && (
				<Link
					className="bg-gray-400 text-lg w-16 text-blue-600 rounded-full p-2 hover:text-blue-400 stroke-2 stroke-current mt-2 mr-2"
					to="./"
				>
					<svg
						className="h-12 md:w-12 bg-gray-400  p-2"
						viewBox="0 0 24 24"
					>
						<Home />
					</svg>
				</Link>
			)}
		</Fragment>
	);
};

/*&nbsp;
<Link to="/profile"> 
<User /> 
</Link> */

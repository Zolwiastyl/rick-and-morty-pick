import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import { renderIcon } from "../api/api";
import { LogOut, LogIn, User, Home } from "react-feather";
import { Button } from "../reusable-ui/Button";

export const Auth0NavBar = () => {
	const { isAuthenticated, client } = useAuth0();

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
					onClick={(evt) => client?.logout()}
					icon={renderIcon(LogOut)}
				/>
			)}
			{isAuthenticated && (
				<Link
					className="bg-gray-400 text-lg w-16 text-blue-600 rounded-full p-2 hover:text-blue-400 stroke-2 stroke-current mt-2"
					to="./design"
				>
					<svg
						className="h-12 w-12 bg-gray-400 rounded-full p-2"
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

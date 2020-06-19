import React, { Fragment } from "react";
import { Home, LogIn, LogOut } from "react-feather";
import { Link } from "react-router-dom";

import { useAuth0 } from "../react-auth0-spa";
import { IconButton } from "../reusable-ui/IconButton";

export const Auth0NavBar = () => {
	const { isAuthenticated, client } = useAuth0();
	return (
		<Fragment>
			{!isAuthenticated && (
				<IconButton
					onClick={(evt) => client?.loginWithRedirect({})}
					icon={LogIn}
				/>
			)}

			{isAuthenticated && (
				<IconButton
					onClick={(evt) =>
						client?.logout({
							returnTo: window.location.origin + "/",
						})
					}
					icon={LogOut}
				/>
			)}
			{isAuthenticated && (
				<Link className="nav-bar-btn" to="./">
					<Home className="h-12 w-12 p-2" viewBox="0 0 24 24" />
				</Link>
			)}
		</Fragment>
	);
};

/*&nbsp;
<Link to="/profile"> 
<User /> 
</Link> */

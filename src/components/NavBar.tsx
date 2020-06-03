import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import { renderIcon } from "../api/api";
import { LogOut, LogIn } from "react-feather";
import { Button } from "../reusable-ui/Button";

export const Auth0NavBar = () => {
	const { isAuthenticated, client } = useAuth0();

	return (
		<div>
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
				<span>
					<Link to="/">Home</Link>&nbsp;
					<Link to="/profile">Profile</Link>
				</span>
			)}
		</div>
	);
};

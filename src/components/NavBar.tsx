import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";

export const NavBar = () => {
	const { isAuthenticated, client } = useAuth0();

	return (
		<div>
			{!isAuthenticated && (
				<button onClick={() => client?.loginWithRedirect({})}>
					Log in
				</button>
			)}

			{isAuthenticated && (
				<button onClick={() => client?.logout()}>Log out</button>
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

import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { Fragment, useEffect } from "react";
import { LogIn, LogOut } from "react-feather";

import { useAuth0 } from "../react-auth0-spa";
import { IconButton } from "../reusable-ui/IconButton";

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
		<div className="flex middle  flex-col">
			<div className="bg-gray-900 justify-end space-y-2 s	pace-x-2 p-2 flex ">
				<LogInButton />
			</div>

			<div className=" flex flex-col self-center justify-center  w-full p-10 text-l text-gray-800 text-justify tracking-wide space-x-3 space-y-4 leading-loose max-w-4xl">
				{" "}
				<h1 className="self-center  text-2xl"> Phloem App </h1>
				<div className=" justify-center max-w-4xl">
					This is my first todo app, that I wanted to do because it
					provides a user with possibility to visualize tasks and their
					dependencies with graphs.
				</div>
				<h2 className=" self-center text-xl"> Main idea </h2>
				<div className=" ">
					When I was trying to use any of already avaliable solutions I
					kept bumping into place where I couldn't plan my tasks. Of
					course, I could divide them in groups or tables but I still
					couldn't think of them in organised manner. I realized that when
					using just a pen and paper drawing tasks as graph where they are
					clearly leading one to another is natural.
				</div>
				<h2></h2>
			</div>
		</div>
	);
};

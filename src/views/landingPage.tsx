import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { ComponentProps, Fragment, ReactNode, useEffect } from "react";
import { GitHub, LogIn, LogOut, Twitter } from "react-feather";

import appLogo from "../assets/app-icon.svg";
import exclamation from "../assets/exclamation.svg";
import questionMark from "../assets/idea-icon.svg";
import lightbulb from "../assets/lightbulb.svg";
import lightining from "../assets/lightining.svg";
import tree from "../assets/tree.svg";
import { useAuth0 } from "../react-auth0-spa";
import { IconButton } from "../reusable-ui/IconButton";

type SectionWithIconProps = {
	icon?: string;
	headerText?: string;
	paragraphText?: string;
	text?: React.ReactNode;
} & ComponentProps<"section">;

let lastColorWasDark = false;

const SectionWithIcon: React.FC<SectionWithIconProps> = ({
	headerText,
	paragraphText,
	children,
	icon,
}) => {
	const colorOfHeaderBackground = lastColorWasDark
		? "bg-gray-100"
		: "bg-white";
	const mainColorOfChunk = lastColorWasDark ? "dark" : "light";
	lastColorWasDark = !lastColorWasDark;
	return (
		<section className={mainColorOfChunk}>
			<div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3">
				<div
					className={
						"flex flex-row justify-center md:relative sticky top-0 " +
						colorOfHeaderBackground
					}
				>
					{icon ? (
						<img
							src={icon}
							alt={headerText + " graphics"}
							className="md:h-40 h-20 object-center flex-shrink-0 self-center sticky top-0"
						></img>
					) : null}
					{headerText ? (
						<h1 className=" text-2xl text-center md:hidden block py-5 px-3 sticky top-0">
							{headerText}{" "}
						</h1>
					) : null}
				</div>
				<div>
					{headerText ? (
						<h1 className=" text-2xl text-center hidden md:block ">
							{headerText}{" "}
						</h1>
					) : null}
					<div className=" justify-center text-xl max-w-4xl min-w-4xl py-10">
						{paragraphText}
						{children}
					</div>
				</div>
				<div className="hidden md:block" />
			</div>
		</section>
	);
};

const redirectOption: RedirectLoginOptions = {
	redirect_uri: window.location.origin + "/app",
};

export const LandingPage: React.FC = () => {
	const { isAuthenticated, client } = useAuth0();
	const LogInButton = ({ ...children }) => {
		useEffect(() => {
			client?.isAuthenticated();
		}, []);
		return (
			<Fragment>
				{!isAuthenticated && (
					<IconButton
						onClick={() => {
							client?.loginWithRedirect(redirectOption);
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
			<div className="bg-gray-900 justify-end space-y-2 space-x-2 p-2 flex ">
				<LogInButton />
			</div>
			<div>
				<main className="grid grid-cols-1 w-full  text-l text-gray-800 text-justify tracking-wide leading-loose">
					{" "}
					<SectionWithIcon
						icon={appLogo}
						headerText={"Phloem App"}
						className="space-x-2"
					>
						This is my first todo app. I wanted to do it because it
						provides a user with possibility to visualize tasks and their
						dependencies with graphs.
						<p></p>
						<button
							onClick={() => {
								client?.loginWithRedirect(redirectOption);
							}}
							className="border border-dashed rounded-lg px-4 hover:border-gray-800 active:outline-non font-bold"
						>
							Try it
						</button>
					</SectionWithIcon>
					<SectionWithIcon
						icon={questionMark}
						headerText={"Why next todo app?"}
					>
						When I was using any of already avaliable solutions I kept
						bumping into place where I could not <b>plan</b> my tasks. I
						didn't know why - I have divided them in groups and tables,
						gave them colors and icons - however I didn't find them handy.
					</SectionWithIcon>
					<SectionWithIcon icon={exclamation} headerText="Found it">
						One day I've realized that instead of wirtting my tasks to app
						I was drawing them as graph with a pencil.
					</SectionWithIcon>
					<SectionWithIcon icon={lightbulb} headerText={"Solution"}>
						Why not make app out of it that will make it easier!
					</SectionWithIcon>
					<SectionWithIcon icon={tree}>
						Omnia Galia est divisa in partes tres quarum unam incolum
						Belgae, aliam Aqutianiae tertiam qui incolunt lingua celtae
						nostra Galli apellantur.
					</SectionWithIcon>
					<SectionWithIcon icon={lightining}>
						Omnia Galia est divisa in partes tres quarum unam incolum
						Belgae, aliam Aqutianiae tertiam qui incolunt lingua celtae
						nostra Galli apellantur.
					</SectionWithIcon>
				</main>
			</div>
			<footer className="flex justify-center text-gray-200  bg-gray-800 tracking-widest p-5 px-10">
				<div className="grid grid-cols-3 w-full md:w-1/2 lg:w-1/3 p-10">
					<span className="lg:p-1"> Find me on: </span>
					<div className="">
						<a
							href="https://twitter.com/zolwiastyl"
							target="_blank"
							rel="noopener noreferrer"
							className="flex justify-center"
						>
							<Twitter className="stroke-current hover:text-primary-600" />
						</a>
					</div>
					<div>
						<a
							className="flex justify-center"
							href="https://github.com/zolwiastyl"
							target="_blank"
							rel="noopener noreferrer"
						>
							<GitHub className="hover:text-gray-900" />
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
};

import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
import React, { ComponentProps, Fragment, ReactNode, useEffect } from "react";
import { LogIn, LogOut } from "react-feather";

import appLogo from "../assets/app-icon.svg";
import whyIcon from "../assets/idea-icon.svg";
import { useAuth0 } from "../react-auth0-spa";
import { IconButton } from "../reusable-ui/IconButton";

type TextChunkProps = {
	headerText: string;
	paragraphText?: string;
	text?: React.ReactNode;
	colorName: string;
} & ComponentProps<"section">;
const TextArticle: React.FC<TextChunkProps> = ({
	headerText,
	paragraphText,
	colorName,
	text,
}) => {
	return (
		<section className={colorName}>
			<div className="grid grid-cols-1 space-y-5">
				<h1 className=" text-2xl text-center "> {headerText} </h1>
				<div className=" justify-center text-xl max-w-4xl py-10">
					{paragraphText}
					{text}
				</div>
			</div>
		</section>
	);
};
type SectionWithIconProps = {
	icon: string;
} & TextChunkProps;
const SectionWithIcon: React.FC<SectionWithIconProps> = ({
	headerText,
	paragraphText,
	colorName,
	text,
	icon,
}) => {
	const colorOfHeaderBackground =
		colorName === "dark" ? "bg-gray-100" : "bg-white";
	return (
		<section className={colorName}>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<div
					className={
						"flex flex-row justify-center md:relative sticky top-0 " +
						colorOfHeaderBackground
					}
				>
					<img
						src={icon}
						alt="app-logo"
						className="md:h-64 h-20 object-center flex-shrink-0 self-center sticky top-0"
					></img>
					<h1 className=" text-2xl text-center md:hidden block py-5 px-3 sticky top-0">
						{headerText}{" "}
					</h1>
				</div>
				<div>
					<h1 className=" text-2xl text-center hidden md:block ">
						{headerText}{" "}
					</h1>
					<div className=" justify-center text-xl max-w-4xl py-10">
						{paragraphText}
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
			<div className="bg-gray-900 justify-end space-y-2 s	pace-x-2 p-2 flex ">
				<LogInButton />
			</div>

			<main className="grid grid-cols-1 w-full  text-l text-gray-800 text-justify tracking-wide space-y-4 leading-loose">
				{" "}
				<SectionWithIcon
					icon={appLogo}
					paragraphText={
						"This is my first todo app. I wanted to do it because it provides a user with possibility to visualize tasks and their dependencies with graphs."
					}
					headerText={"Phloem App"}
					colorName="dark"
				/>
				{/* <section className="dark">
					<div className="grid grid-cols-3">
						<div className="flex flex-row justify-center">
							<img
								src={appLogo}
								alt="app-logo"
								className="h-64 object-center flex-shrink-0 "
							></img>
						</div>

						<div>
							<h1 className=" text-3xl text-center ">Phloem App </h1>
							<div className=" justify-center text-xl max-w-4xl py-10">
								
							</div>
						</div>
						<div />
					</div>
				</section> */}
				<SectionWithIcon
					icon={whyIcon}
					paragraphText={secondParagraphText}
					headerText={"Why this app?"}
					colorName="light"
				/>
				<TextArticle
					paragraphText={secondParagraphText}
					headerText={"Main idea"}
					colorName={"dark"}
				/>
				<TextArticle
					colorName={"light"}
					headerText={"Header"}
					paragraphText={
						"Omnia Galia est divisa in partes tres quarum unam incolum Belgae, aliam Aqutianiae tertiam qui incolunt lingua celtae nostra Galli apellantur "
					}
				>
					<div>text from children</div>
					<button
						onClick={() => {
							client?.loginWithRedirect(redirectOption);
						}}
					>
						Try it
					</button>
				</TextArticle>
				<TextArticle
					colorName={"dark"}
					headerText={"Header"}
					paragraphText={"whole paraghraph"}
				/>
				<TextArticle
					colorName={"light"}
					headerText={"trixy"}
					paragraphText={"another paragraph text"}
				>
					<span>Another paragraph with text inside</span>
				</TextArticle>
			</main>
		</div>
	);
};

const secondParagraphText =
	"When I was trying to use any of already avaliable solutions I kept bumping into place where I could not plan my tasks. Of course, I could divide them in groups or tables but I still couldn't think of them in organised manner. I realized that when using just a pen and paper drawing tasks as graph where they are clearly leading one to another is natural.";

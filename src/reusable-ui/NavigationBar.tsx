import React, { FunctionComponent } from "react";

type NavBarProps = {
	children: React.ReactNode;
};

export const NavigationBar: FunctionComponent<NavBarProps> = ({ children }) => {
	return (
		<div
			className="md:flex md:flex-col flex flex-row md:relative 
			bg-blue-200 md:h-full md:min-h-screen md:fixed p-2 md:p-5 md:w-24
			md:rounded-r-lg md:justify-start justify-end
			sm:relative"
		>
			{children}
		</div>
	);
};

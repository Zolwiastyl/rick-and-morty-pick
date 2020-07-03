import React, { FunctionComponent } from "react";

type NavBarProps = {
	children: React.ReactNode;
};

export const NavigationBar: FunctionComponent<NavBarProps> = ({ children }) => {
	return (
		<div
			className="md:flex md:flex-col flex flex-row md:relative 
			bg-gray-900 md:h-full md:min-h-screen  md:p-5 md:w-24
			md:space-x-0 md:space-y-2
			space-x-2
			md:rounded-r-lg md:justify-start  items-center justify-end
			sm:relative"
		>
			{children}
		</div>
	);
};

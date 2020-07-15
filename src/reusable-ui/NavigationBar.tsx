import React, { ComponentProps, FunctionComponent } from "react";

type NavBarProps = {
	children: React.ReactNode;
} & ComponentProps<"div">;

export const NavigationBar: FunctionComponent<NavBarProps> = ({ children }) => {
	return (
		<div
			className="md:flex md:flex-col flex flex-row md:relative 
			bg-gray-900 md:h-full md:min-h-screen  md:p-5 md:w-24
			md:space-x-0 space-y-3
			space-x-2 p-2
			md:rounded-r-lg md:justify-start  items-center justify-end
			sm:relative"
		>
			{children}
		</div>
	);
};

import React, { ComponentProps, FunctionComponent } from "react";

type NavBarProps = {
	children: React.ReactNode;
} & ComponentProps<"div">;

export const NavigationBar: FunctionComponent<NavBarProps> = ({ children }) => {
	return (
		<div
			className="
			bg-gray-900
			flex flex-row
			overflow-x-auto
			overflow-y-auto
			md:static md:top-0
			 
			w-full
			justify-start
			
			space-y-3
			flex-shrink-0
			space-x-2 p-2 py-2
			items-center 
			md:flex md:flex-col
			md:h-full md:min-h-screen  md:p-5 md:w-24
			md:space-x-0
			
			md:rounded-r-lg md:justify-start  
			"
		>
			{children}
		</div>
	);
};

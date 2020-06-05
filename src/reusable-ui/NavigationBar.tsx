import React, { FunctionComponent } from "react";

export const NavigationBar: FunctionComponent = ({ children }) => {
	return (
		<div className="flex flex-col relative bg-blue-100 h-full min-h-screen fixed left p-5 w-24">
			{children}
		</div>
	);
};

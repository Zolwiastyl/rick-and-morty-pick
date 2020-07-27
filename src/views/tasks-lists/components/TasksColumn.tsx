import React from "react";

import { Status } from "../../../types";

interface TaskColumnProps extends React.ComponentProps<"div"> {
	status: Status;
}
export const TasksColumn: React.FC<TaskColumnProps> = ({
	status: { statusName, icon: StatusIcon },
	children,
	...rest
}) => {
	return (
		<div
			className="
            bg-gray-100 hover:bg-gray-200
            rounded-lg p-1
            flex flex-col 
			w-64 md:w-1/5
			box-border
            "
			{...rest}
		>
			<header className="flex flex-row w-64 md:w-full items-center justify-center">
				<StatusIcon className="p-2 max-h-sm" size="2.5rem" />
				<p className="self-center p-4">{statusName}</p>
			</header>

			<div className=" flex-grow overflow-y-auto scrolling-touch box-border max-h-full">
				<div className="w-full max-w-full overflow-y-auto space-y-1 flex flex-col box-border">
					{children}
				</div>
			</div>
		</div>
	);
};

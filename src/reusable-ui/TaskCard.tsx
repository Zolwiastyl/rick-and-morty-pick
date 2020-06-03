import React, { FunctionComponent } from "react";
import { Task } from "../types";
import { renderIcon } from "../api/api";
import { X } from "react-feather";

type TaskCardProps = {
	task: Partial<Task>;
};

export const TaskCard: FunctionComponent<TaskCardProps> = (
	props: TaskCardProps
) => {
	return (
		<div
			className="bg-blue-200 rounded-lg max-w-3xl w-56 text-lg h-64 m-2 p-1
	 x-"
		>
			<header className="flex flex-row mt-1 justify-center border-b border-gray-900 py-1">
				<div className="self-start text-xl  mr-5 overflow-auto h-full w-full">
					{props.task.name}
				</div>
				<div
					className={
						props.task.isReady
							? "rounded-full m-1 w-4 h-4 self-center p-3 bg-green-600"
							: "rounded-full m-1 w-4 h-4 self-center p-3 bg-red-600"
					}
				></div>
				<button className="bg-blue-100 rounded-full object-right self-end">
					{renderIcon(X)}
				</button>
			</header>
			<div>
				<div className="p-4">description of the task</div>
				<div></div>
			</div>
		</div>
	);
};

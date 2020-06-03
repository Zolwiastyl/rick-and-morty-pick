import React, { FunctionComponent } from "react";
import { Task } from "../types";

type TaskCardProps = {
	task: Partial<Task>;
};

export const TaskCard: FunctionComponent<TaskCardProps> = (
	task: TaskCardProps
) => {
	return (
		<div className="bg-blue-900">
			<header>{task.task.name}</header>
		</div>
	);
};

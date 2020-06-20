import React from "react";
import { Trash2 } from "react-feather";

import { callApi } from "../../../api/api";
import {
	curriedRemoveTask,
	removeCrossDependencies,
	saveTheDiff,
} from "../../../api/removeTask";
import { curriedSendMultipleTasks } from "../../../api/sendMultipleTasks";
import { Task, TasksStateProps } from "../../../types";
export const DeleteButton = (
	task: Task,
	{ tasks, setTasks }: TasksStateProps,
	client: any
) => {
	return (
		<button
			className="on-task-btn"
			onClick={() => {
				if (
					callApi(
						client,
						curriedSendMultipleTasks(
							removeCrossDependencies(task.frontEndId, tasks)
						)
					) &&
					callApi(client, curriedRemoveTask(task))
				) {
					setTasks(
						saveTheDiff(
							tasks,
							removeCrossDependencies(task.frontEndId, tasks)
						).filter((t) => t.frontEndId !== task.frontEndId)
					);
				}
			}}
		>
			<Trash2 />
		</button>
	);
};

import React from "react";
import { Task, TasksStateProps } from "../../../types";
import { callApi } from "../../../api/api";
import { curriedSendMultipleTasks } from "../../../api/sendMultipleTasks";
import {
	removeCrossDependencies,
	curriedRemoveTask,
	saveTheDiff,
} from "../../../api/removeTask";
import { Trash2 } from "react-feather";
export const DeleteButton = (
	task: Task,
	{ tasks, setTasks }: TasksStateProps,
	client: any
) => {
	return (
		<button
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
				console.log(tasks.filter((t) => t.frontEndId !== task.frontEndId));
			}}
		>
			<Trash2 />
		</button>
	);
};

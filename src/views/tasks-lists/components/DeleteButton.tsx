import React, { useContext } from "react";
import { Trash2 } from "react-feather";

import { callApi } from "../../../api/api";
import {
	curriedRemoveTask,
	removeCrossDependencies,
	saveTheDiff,
} from "../../../api/removeTask";
import { curriedSendMultipleTasks } from "../../../api/sendMultipleTasks";
import { ClientContext } from "../../../App";
import { Task, TasksStateProps } from "../../../types";
export const DeleteButton = (
	task: Task,
	{ tasks, setTasks }: TasksStateProps,
	client: any
) => {
	const clientAPI = useContext(ClientContext);
	return (
		<button
			className="on-task-btn"
			onClick={() => {
				if (
					clientAPI?.callApi(
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

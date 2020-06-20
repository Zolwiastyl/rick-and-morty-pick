import { Task, TasksStateProps } from "../types";
import { curry } from "./api";
import { sendNewTask } from "./sendNewTask";

/**
 *
 * @param state array of tasks and setTasks func
 * @param status to which status task should shift
 * @param task which task we are talking about
 * @param token token from auth0 to send to backend
 */

export const curriedMoveToAnotherGroup = curry(moveToAnotherGroup);

/**
 *
 * @param state array of tasks and setTasks func
 * @param status to which status task should shift
 * @param task which task we are talking about
 * @param token token from auth0 to send to backend
 */

export function moveToAnotherGroup(
	state: TasksStateProps,
	status: string,
	task: Task,
	token: any
) {
	if (
		sendNewTask(
			{
				...task,

				status: status,
			},
			token
		)
	) {
		// UPDATE LOCAL COPY

		state.setTasks(
			state.tasks
				.filter((t) => t.frontEndId !== task.frontEndId)
				.concat([{ ...task, status: status }])
		);
	} else {
		return console.error("couldn't sent the task to server");
	}
}

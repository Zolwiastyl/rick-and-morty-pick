import { GroupOfTasks, GroupStateProps, Task, TasksStateProps } from "../types";
import { curry } from "./api";
import { sendNewGroup } from "./sendNewGroup";
import { sendNewTask } from "./sendNewTask";

/**
 *
 * @param state array of tasks and setTasks func
 * @param status to which status task should shift
 * @param task which task we are talking about
 * @param token token from auth0 to send to backend
 */

export const curriedMoveToAnotherColumn = curry(moveToAnotherColumn);

/**
 *
 * @param state array of tasks and setTasks func
 * @param status to which status task should shift
 * @param task which task we are talking about
 * @param token token from auth0 to send to backend
 */

export function moveToAnotherColumn(
	state: TasksStateProps | GroupStateProps,
	status: string,
	item: Task | GroupOfTasks,
	token: any
) {
	if ((item as Task).dependOnThisTask) {
		const stateAsserted = state as TasksStateProps;
		if (
			sendNewTask(
				{
					...item,

					status: status,
				},
				token
			)
		) {
			// UPDATE LOCAL COPY
			console.log("submitted");

			console.log(item);

			return stateAsserted.setTasks(
				stateAsserted.tasks
					.filter((t) => t.frontEndId !== (item as Task).frontEndId)
					.concat([{ ...(item as Task), status: status }])
			);
		} else {
			return console.error("couldn't sent the task to server");
		}
	} else {
		if (
			sendNewGroup(
				{
					...(item as GroupOfTasks),
					status: status,
				},
				token
			)
		) {
			const stateAsserted = state as GroupStateProps;
			return stateAsserted.setGroups(
				stateAsserted.groups
					.filter((g) => g.groupId !== (item as GroupOfTasks).groupId)
					.concat([{ ...(item as GroupOfTasks), status: status }])
			);
		}
	}
}

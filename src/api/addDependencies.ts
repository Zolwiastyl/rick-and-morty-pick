import { ClientAPI, Edge, Task } from "../types";

type TaskId = string;

/**
 *
 * @param tasks array of tasks
 * @param tasksId first id is source, second is target
 */

export function makeNewTasksWithDependencies(
	tasks: Task[],
	tasksId: readonly [TaskId, TaskId]
): Edge {
	return [
		{
			...tasks.find((t) => t.frontEndId === tasksId[0])!,
			dependOnThisTask: tasks
				.find((t) => t.frontEndId === tasksId[0])!
				.dependOnThisTask.concat([tasksId[1]]),
		},
		{
			...tasks.find((t) => t.frontEndId === tasksId[1])!,
			dependencyId: tasks
				.find((t) => t.frontEndId === tasksId[1])!
				.dependencyId.concat([tasksId[0]]),
		},
	];
}

export function sendSourceAndTargetTasks(
	clientAPI: ClientAPI,
	callback: Function,
	callbackArguments: Task[]
) {
	if (
		clientAPI.callApi(callback(callbackArguments[0])) &&
		clientAPI.callApi(callback(callbackArguments[1]))
	) {
		return true;
	} else {
		return false;
	}
}

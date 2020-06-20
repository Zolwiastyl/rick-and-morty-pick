import { Auth0Client } from "@auth0/auth0-spa-js";

import { Edge, Task } from "../types";
import { callApi } from "./api";

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
	client: Auth0Client | undefined,
	callback: Function,
	callbackArguments: Task[]
) {
	if (
		callApi(client, callback(callbackArguments[0])) &&
		callApi(client, callback(callbackArguments[1]))
	) {
		return true;
	} else {
		return false;
	}
}

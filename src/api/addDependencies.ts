import { Auth0Client } from "@auth0/auth0-spa-js";

import { Task } from "../types";
import { copyTaskById } from "../views/tasks-graph/GraphAPI";
import { callApi } from "./api";

type Source = Task;
type Target = Task;
type Edge = [Source, Target];

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
	console.log(
		tasks.map((t) => ({ key: t.frontEndId, value: t.name })),
		tasksId
	);
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

export function makeNewTasksRemovingDependencies(
	tasks: Task[],
	tasksId: readonly [TaskId, TaskId]
): Edge {
	const sourceTaskToSave: Task = {
		...tasks.find((t) => t.frontEndId === tasksId[0])!,
		dependOnThisTask: tasks
			.find((t) => t.frontEndId === tasksId[0])!
			.dependOnThisTask.filter((id) => id !== tasksId[1]),
	};
	const targetTaskToSave: Task = {
		...tasks.find((t) => t.frontEndId === tasksId[1])!,
		dependencyId: {
			...copyTaskById(tasks, tasksId[1]),
		}.dependencyId.filter((id) => id !== tasksId[0]),
	};

	return [sourceTaskToSave, targetTaskToSave];
}

export function sendSourceAndTargetTasks(
	client: Auth0Client | undefined,
	callback: Function,
	callbackArguments: Task[]
) {
	console.log("sending source and target task");
	if (
		callApi(client, callback(callbackArguments[0])) &&
		callApi(client, callback(callbackArguments[1]))
	) {
		return true;
	} else {
		return false;
	}
}

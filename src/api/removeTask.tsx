import { Task } from "../types";
import { curry, TaskPlacement } from "../api";

export const curriedRemoveCrossDependencies = curry(removeCrossDependencies);

export enum FromWhere {
	dependsOnIt = "dependsOnIt",
	dependencyId = "dependencyId",
}

export function saveTheDiff(tasks: Task[], tasksDiff: Task[]) {
	return tasks
		.filter(
			(t) =>
				!tasksDiff.map((tdiff) => tdiff.frontEndId).includes(t.frontEndId)
		)
		.concat(tasksDiff);
}

export function removeCrossDependencies(taskId: string, tasks: Task[]): Task[] {
	const taskToDelete = tasks.find((t) => t.frontEndId == taskId);
	const tasksToReturn = removeIdFromOtherTasks(
		taskToDelete?.dependOnThisTask!.slice(),
		tasks,
		taskId,
		removeIdFromOtherTasks(
			taskToDelete?.dependencyId!.slice(),
			tasks,
			taskId,
			[]
		)
	)
		.filter((t) => t.frontEndId != taskId)
		.sort((x, y) => y.ordinalNumber - x.ordinalNumber);
	console.log(tasksToReturn);
	return tasksToReturn;
}

export function takeIdsArray(task: Task, theEnum: FromWhere): string[] {
	if (theEnum == "dependsOnIt") {
		return task.dependOnThisTask;
	}
	return task.dependencyId;
}

export function removeIdFromOtherTasks(
	arrayOfIds: string[],
	tasks: Task[],
	taskId: string,
	tasksDiff: Task[]
): Task[] {
	if (arrayOfIds.length > 0) {
		console.log(arrayOfIds);
		const idToProcess = arrayOfIds.pop();
		console.log(idToProcess);
		const taskToOverwrite: Task = tasks.find(
			(t) => t.frontEndId == idToProcess
		)!;
		const taskToSave: Task = {
			...taskToOverwrite,
			dependencyId: taskToOverwrite?.dependencyId?.filter(
				(id) => id !== taskId
			),
			dependOnThisTask: taskToOverwrite?.dependOnThisTask?.filter(
				(id) => id !== taskId
			),
		};
		tasksDiff.push(taskToSave);
		return removeIdFromOtherTasks(arrayOfIds, tasks, taskId, tasksDiff);
	} else {
		return tasksDiff;
	}
}

export function overwriteTask(tasks: Task[], task: Task): Task[] {
	return tasks.filter((t) => t.frontEndId !== task.frontEndId).concat(task);
}

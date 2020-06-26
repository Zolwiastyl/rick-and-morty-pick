import { Task, TaskId } from "../types";
import { copyTaskById } from "../views/tasks-graph/graphAPI";

type Source = Task;
type Target = Task;
type Edge = [Source, Target];

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

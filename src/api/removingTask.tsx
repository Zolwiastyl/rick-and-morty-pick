import { Task } from "../types";

export function removeTaskFromDependencies(taskId: string, tasks: Task[]) {
  tasks
    .find((t) => t.frontEndId == taskId)
    ?.dependencyId.map((id) => tasks.find((t) => t.frontEndId == id));
}

/*
take task
take its dependencies:
go through dependencies, remove the task from their "depends on it"
add to depends on it all depends on it of removed tasks.
go to all tasks from
*/

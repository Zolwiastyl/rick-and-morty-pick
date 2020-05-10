import { Task, TasksStateProps } from "./types";
import {
  NodeDefinition,
  EdgeDefinition,
  ElementDefinition,
  Core,
} from "cytoscape";
import { callApi, curriedSendNewTask } from "./api";
import { Auth0Client } from "@auth0/auth0-spa-js";

export function prepareElementsForGraph(tasks: Task[]) {
  const nodes: NodeDefinition[] = tasks.map((t) => {
    return { data: { id: t.frontEndId, label: t.name } };
  });
  const edges: EdgeDefinition[] = tasks
    .map((t) => {
      return t.dependOnThisTask.map((id) => {
        const newEdge: EdgeDefinition = {
          data: { source: t.frontEndId, target: id },
          selectable: true,
        };
        return newEdge;
      });
    })
    .flat(10);
  const elements: ElementDefinition[] = nodes.concat(edges);
  console.log(elements);
  return elements;
}

export const graphStyle: cytoscape.Stylesheet[] = [
  {
    selector: "node",
    style: {
      height: 80,
      width: 80,
      "background-fit": "cover",
      "border-color": "inherit",
      "border-width": 5,
      "border-opacity": 0.1,

      label: "data(label)",
      "text-max-width": "15em",
      "text-wrap": "wrap",
      "text-halign": "left",
      "text-valign": "top",
      "text-outline-color": "white",
      "text-outline-width": 3,
      "text-outline-opacity": 1,
      "text-events": "yes",
    },
  },
  {
    selector: "edge",
    style: {
      width: 7,
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
];

function replaceTask(tasks: Task[], task: Task): Task[] {
  return tasks.filter((t) => t.frontEndId != task.frontEndId).concat([task]);
}

export function copyTaskById(tasks: Task[], id: string): Task {
  return tasks.find((t) => t.frontEndId == id)!;
}

function copyTask(tasks: Task[], whatTask: Task): Task {
  return tasks.find((t) => t.frontEndId == whatTask.frontEndId)!;
}
/**
 *
 * @param tasks array of tasks
 * @param tasksId first id is source, second is target
 */
export function makeNewTasksWithDependencies(tasks: Task[], tasksId: string[]) {
  return [
    {
      ...tasks.find((t) => t.frontEndId == tasksId[0])!,
      dependOnThisTask: tasks
        .find((t) => t.frontEndId == tasksId[0])!
        .dependOnThisTask.concat([tasksId[1]]),
    },
    {
      ...tasks.find((t) => t.frontEndId == tasksId[1])!,
      dependencyId: tasks
        .find((t) => t.frontEndId == tasksId[1])!
        .dependencyId.concat([tasksId[0]]),
    },
  ];
}

export function makeNewTasksRemovingDependencies(
  tasks: Task[],
  tasksId: string[]
) {
  const sourceTaskToSave: Task = {
    ...tasks.find((t) => t.frontEndId == tasksId[0])!,
    dependOnThisTask: tasks
      .find((t) => t.frontEndId == tasksId[0])!
      .dependOnThisTask.filter((id) => id !== tasksId[1]),
  };
  const targetTaskToSave: Task = {
    ...tasks.find((t) => t.frontEndId == tasksId[1])!,
    dependencyId: {
      ...copyTaskById(tasks, tasksId[1]),
    }.dependencyId.filter((id) => id !== tasksId[0]),
  };

  return [sourceTaskToSave, targetTaskToSave];
}

function findChangeReplaceDependency(
  tasks: Task[],
  task: Task,
  { dependencyId }: Task
) {
  return replaceTask(tasks, {
    ...copyTask(tasks, task),
    dependencyId: dependencyId,
  });
}

function findChangeReplaceDependsOnIt(
  tasks: Task[],
  task: Task,
  { dependOnThisTask }: Task
) {
  return replaceTask(tasks, {
    ...copyTask(tasks, task),
    dependOnThisTask: dependOnThisTask,
  });
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

function findTasks(tasks: Task[], ids: string[]) {
  return tasks.filter((t) => t.frontEndId == ids[0] || t.frontEndId == ids[1]);
}

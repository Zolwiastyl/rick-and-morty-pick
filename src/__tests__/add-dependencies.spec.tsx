import { makeNewTasksWithDependencies } from "../GraphAPI";
import { Task } from "../types";

const tasks: Task[] = require("./mockup-addDependencies.json");

test("expect 5 to be 5", () => {
  expect(5).toBe(5);
});

test("expect it tasks to be equal to new mockup", () => {
  expect(
    makeNewTasksWithDependencies(tasks, [
      sourceTaskMockup.frontEndId,
      targetTaskMockup.frontEndId,
    ])
  ).toStrictEqual([sourceTaskMockup, targetTaskMockup]);
});

console.log(makeNewTasksWithDependencies(tasks, ["Task1Id", "Task2Id"]));

const sourceTaskMockup: Task = {
  dependOnThisTask: ["Task2Id"],
  dependencyId: [],
  frontEndId: "Task1Id",
  isReady: false,
  name: "Task 1",
  ordinalNumber: 1.05,
  status: "todo",
  userId: "github|45352717",
};
const targetTaskMockup: Task = {
  dependOnThisTask: [],
  dependencyId: ["Task1Id"],
  frontEndId: "Task2Id",
  isReady: false,
  name: "Task 2",
  ordinalNumber: 0.525,
  status: "todo",
  userId: "github|45352717",
};

const readyTasksMockup: Task[] = [];

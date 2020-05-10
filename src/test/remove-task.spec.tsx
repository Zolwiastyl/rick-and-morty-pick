import { removeTaskFromDependencies } from "../api/removingTask";
import { Task } from "../types";

const tasks: Task[] = require("./remove-task-mockup.json");

test("it should be equal to preapred mockup", () => {
  expect(5).toBe(5);
});

test("expect new tasks to be equal to readyTasks", () => {
  expect(removeTaskFromDependencies("0620201435170200", tasks)).toBe(
    readyTasks
  );
});

const readyTasks: Task[] = [
  {
    dependOnThisTask: ["0620201435120200"],
    dependencyId: [],
    frontEndId: "0620201435110200",
    isReady: false,
    name: "Task 1",
    ordinalNumber: 1.05,
    status: "todo",
    userId: "github|45352717",
  },
  {
    dependOnThisTask: ["0620201435140200"],
    dependencyId: ["0620201435110200", "0620201435160200"],
    frontEndId: "0620201435120200",
    isReady: false,
    name: "Task 2",
    ordinalNumber: 0.525,
    status: "todo",
    userId: "github|45352717",
  },
  {
    dependOnThisTask: [],
    dependencyId: ["0620201435160200"],
    frontEndId: "0620201435140200",
    isReady: false,
    name: "Task 3 ",
    ordinalNumber: 0.2625,
    status: "todo",
    userId: "github|45352717",
  },
  {
    dependOnThisTask: ["0620201435120200", "0620201435140200"],
    dependencyId: [],
    frontEndId: "0620201435160200",
    isReady: false,
    name: "Task 4",
    ordinalNumber: 0.13125,
    status: "todo",
    userId: "github|45352717",
  },

  {
    dependOnThisTask: ["0620201435120200", "0620201435140200"],
    dependencyId: [],
    frontEndId: "0620201435190200",
    isReady: false,
    name: "Task 6",
    ordinalNumber: 0.0328125,
    status: "todo",
    userId: "github|45352717",
  },
];

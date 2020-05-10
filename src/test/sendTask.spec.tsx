import { sendNewTask } from "../api";
import { Task } from "../types";

const mockupTask: Task = {
  dependOnThisTask: ["Task2Id"],
  dependencyId: ["Task6Id"],
  frontEndId: "Task5Id",
  isReady: false,
  name: "Task 5",
  ordinalNumber: 0.065625,
  status: "todo",
  userId: "github|45352717",
};

test("it should return error", () => {
  expect(sendNewTask(mockupTask, "someToken")).toBe(false);
});

console.log(sendNewTask(mockupTask, "dupa1"));

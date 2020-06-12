import { Task } from "../../types";
import {
	overwriteTask,
	removeCrossDependencies,
	saveTheDiff,
	takeIdsArray,
} from "../removeTask";

const tasks: Task[] = require("./remove-task-mockup.json");
const tasks2: Task[] = require("./mockup-remove-task-2.json");

test("how much  is it", () =>
	console.log(removeCrossDependencies("1120200852290200", tasks2)));

test("expect new tasks to be equal to readyTasks", () => {
	expect(removeCrossDependencies("Task5Id", tasks)).toStrictEqual(readyTasks);
});

test.each`
	a    | b                 | expected
	${0} | ${"dependencyId"} | ${[]}
	${1} | ${"dependencyId"} | ${["Task1Id", "Task5Id"]}
	${0} | ${"dependsOnIt"}  | ${["Task2Id"]}
	${1} | ${"dependsOnIt"}  | ${["Task3Id"]}
`("task [$a] $b should return $expected", ({ a, b, expected }) => {
	expect(takeIdsArray(tasks[a], b)).toStrictEqual(expected);
});

test("overwritting new tasks", () => {
	expect(overwriteTask(tasksToOverWrite, newTask)).toStrictEqual(
		tasksOverWritten
	);
});

test("saving diffs", () => {
	expect(saveTheDiff(tasks, readyTasks)).toStrictEqual(tasksWithDiff);
});

const tasksToOverWrite: Task[] = [
	{
		dependOnThisTask: ["Task2Id"],
		dependencyId: [],
		frontEndId: "Task1Id",
		isReady: false,
		name: "Task 1",
		ordinalNumber: 1.05,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: ["Task3Id"],
		dependencyId: ["Task1Id", "Task5Id"],
		frontEndId: "Task2Id",
		isReady: false,
		name: "Task 2",
		ordinalNumber: 0.525,
		status: "todo",
		userId: "github|45352717",
	},
];

const newTask: Task = {
	dependOnThisTask: [],
	dependencyId: [],
	frontEndId: "Task1Id",
	isReady: false,
	name: "Task 1",
	ordinalNumber: 1.05,
	status: "todo",
	userId: "github|45352717",
};

const tasksOverWritten: Task[] = [
	{
		dependOnThisTask: ["Task3Id"],
		dependencyId: ["Task1Id", "Task5Id"],
		frontEndId: "Task2Id",
		isReady: false,
		name: "Task 2",
		ordinalNumber: 0.525,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task1Id",
		isReady: false,
		name: "Task 1",
		ordinalNumber: 1.05,
		status: "todo",
		userId: "github|45352717",
	},
];

const readyTasks: Task[] = [
	{
		dependOnThisTask: ["Task3Id"],
		dependencyId: ["Task1Id"],
		frontEndId: "Task2Id",
		isReady: false,
		name: "Task 2",
		ordinalNumber: 0.525,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task4Id",
		isReady: false,
		name: "Task 4",
		ordinalNumber: 0.13125,
		status: "todo",
		userId: "github|45352717",
	},

	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task6Id",
		isReady: false,
		name: "Task 6",
		ordinalNumber: 0.0328125,
		status: "todo",
		userId: "github|45352717",
	},
];

const tasksWithDiff = [
	{
		dependOnThisTask: ["Task2Id"],
		dependencyId: [],
		frontEndId: "Task1Id",
		isReady: false,
		name: "Task 1",
		ordinalNumber: 1.05,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task3Id",
		isReady: false,
		name: "Task 3 ",
		ordinalNumber: 0.2625,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: ["Task2Id"],
		dependencyId: ["Task6Id", "Task4Id"],
		frontEndId: "Task5Id",
		isReady: false,
		name: "Task 5",
		ordinalNumber: 0.065625,
		status: "todo",
		userId: "github|45352717",
	},
	...readyTasks,
];

import { Task } from "../../types";
import { makeNewTasksRemovingDependencies } from "../removeDependencies";

const tasks = require("./remove-dependencies.json");

const returnedTasks: Task[] = [
	{
		dependOnThisTask: ["0620201435140200", "0620201435160200"],
		dependencyId: [],
		frontEndId: "0620201435110200",
		isReady: false,
		name: "Task 1",
		ordinalNumber: 1.05,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "0620201435120200",
		isReady: false,
		name: "Task 2",
		ordinalNumber: 0.525,
		status: "todo",
		userId: "github|45352717",
	},
];
const sourceMockupId = "0620201435110200";
const targetMockupId = "0620201435120200";

test("it should be the same as mockup", () => {
	expect(
		makeNewTasksRemovingDependencies(tasks, [sourceMockupId, targetMockupId])
	).toStrictEqual(returnedTasks);
});

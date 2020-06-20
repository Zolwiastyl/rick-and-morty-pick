import { makeNewTasksRemovingDependencies } from "../../removeDependencies";

const tasks = require("./before.json");

const returnedTasks = [
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "2020201146250200",
		isReady: false,
		name: "task one",
		ordinalNumber: 1.05,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: ["2020201146290200"],
		dependencyId: [],
		frontEndId: "2020201146270200",
		isReady: false,
		name: "task two",
		ordinalNumber: 0.525,
		status: "todo",
		userId: "github|45352717",
	},
];
const sourceMockupId = "2020201146250200";
const targetMockupId = "2020201146270200";

test("it should be the same as mockup", () => {
	expect(
		makeNewTasksRemovingDependencies(tasks, [sourceMockupId, targetMockupId])
	).toStrictEqual(returnedTasks);
});

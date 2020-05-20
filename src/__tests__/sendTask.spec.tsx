import { sendNewTask, plainSendNewTask, plainSendMultipleTasks } from "../api";
import { Task } from "../types";

const BaseUrl: string = "https://httpstat.us/";

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

const mockupTasks: Task[] = require("./mockup-for-graph.json");

test("it should return error", () => {
	expect(sendNewTask(mockupTask, "someToken")).resolves.toBe(false);
});

test.each`
	a        | expected
	${"429"} | ${false}
	${"404"} | ${false}
	${"500"} | ${false}
	${"410"} | ${false}
	${"200"} | ${true}
	${"250"} | ${true}
`("sendNewTask for url $a should return $expected", ({ a, expected }) => {
	expect(
		plainSendNewTask(mockupTask, "someToken", new Request(BaseUrl + a))
	).resolves.toBe(expected);
});

test("it should return error", () => {
	expect(sendNewTask(mockupTask, "someToken")).resolves.toBe(false);
});

test.each`
	a        | expected
	${"429"} | ${false}
	${"404"} | ${false}
	${"500"} | ${false}
	${"410"} | ${false}
	${"200"} | ${true}
	${"250"} | ${true}
`("sendNewTask for url $a should return $expected", ({ a, expected }) => {
	expect(
		plainSendMultipleTasks(mockupTasks, "someToken", new Request(BaseUrl + a))
	).resolves.toBe(expected);
});

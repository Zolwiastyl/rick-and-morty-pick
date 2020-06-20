import { Task } from "../../../types";
import { removeCrossDependencies, saveTheDiff } from "../../removeTask";
import after from "./after.json";
import before from "./before.json";

test("it should return theDiff.json", () => {
	expect(removeCrossDependencies(before[2].frontEndId, before)).toStrictEqual(
		after.slice(1)
	);
});

const newTaskThree: Task = removeCrossDependencies(
	before[2].frontEndId,
	before
)[0];

const newTasksAfter = before
	.filter(
		(t) =>
			t.frontEndId !== newTaskThree.frontEndId &&
			t.frontEndId !== before[2].frontEndId
	)
	.concat([newTaskThree]);

const newTaskThreeInArray: Task[] = removeCrossDependencies(
	before[2].frontEndId,
	before
);

test("this should be true", () => {
	expect(
		newTaskThreeInArray
			.map((task) => task.frontEndId)
			.includes(newTaskThree.frontEndId)
	).toBe(true);
});

const newTasksAfter2 = before
	.map((t) => {
		if (
			newTaskThreeInArray
				.map((task) => task.frontEndId)
				.includes(t.frontEndId)
		) {
			return null;
		} else {
			return t;
		}
	})
	.filter((t) => t !== null)
	.filter((t) => t!.frontEndId !== before[2].frontEndId);

const newTasksAfter3 = before
	.filter(
		(t) =>
			!newTaskThreeInArray.map((t) => t.frontEndId).includes(t.frontEndId)
	)
	.filter((t) => t.frontEndId !== before[2].frontEndId)
	.concat(newTaskThreeInArray);

const newTaskAfter4 = saveTheDiff(before, newTaskThreeInArray).filter(
	(t) => t.frontEndId !== before[2].frontEndId
);

test("this brute force for multiple tasks should work", () => {
	expect(newTasksAfter2).toStrictEqual(after.slice(0, 1));
});
test("this brute force for multiple tasks should work", () => {
	expect(newTasksAfter3).toStrictEqual(after);
});

test("this brute force should wokr", () => {
	expect(newTasksAfter).toStrictEqual(after);
});

test("testing removeCrossDependencies", () => {
	expect(removeCrossDependencies(before[2].frontEndId, before)).toStrictEqual(
		after.slice(1)
	);
});
test("is save the diff working", () => {
	expect(newTaskAfter4).toStrictEqual(after);
});

const newTaskThreeByFunction = removeCrossDependencies(
	before[2].frontEndId,
	before
);

test("this is using precalculated value for tasks", () => {
	expect(
		saveTheDiff(before, newTaskThreeByFunction).filter(
			(t) => t.frontEndId !== before[2].frontEndId
		)
	).toStrictEqual(after);
});

test("it should return after.json", () => {
	expect(
		saveTheDiff(
			before,
			removeCrossDependencies(before[2].frontEndId, before)
		).filter((t) => t.frontEndId !== before[2].frontEndId)
	).toStrictEqual(after);
});

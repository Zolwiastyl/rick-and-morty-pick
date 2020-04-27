import { takeOrdinalNumbers, TaskPlacement, curry, putItBelow } from "./api";
import { Task } from "./types";
import { array } from "prop-types";

const mockUpTasks = require("./tasks-mockup.json");
const sortByOrdinalNumbers = (x: Task, y: Task) =>
  x.ordinalNumber - y.ordinalNumber;
const indexOfDraggedTask = mockUpTasks.sort(sortByOrdinalNumbers)[2].frontEndId;

const takeOrdinalsNumbersFromMockupFor3rdTask = (
  idOfEventTarget: string,
  wherePlaceTask: TaskPlacement
) =>
  takeOrdinalNumbers(
    wherePlaceTask,
    indexOfDraggedTask,
    idOfEventTarget,
    mockUpTasks
  );

const placeItAbove = (idOfEventTarget: string) =>
  takeOrdinalsNumbersFromMockupFor3rdTask(idOfEventTarget, TaskPlacement.Above);
const placeItBelow = (idOfEventTarget: string) =>
  takeOrdinalsNumbersFromMockupFor3rdTask(idOfEventTarget, TaskPlacement.Below);
test.each`
  a                     | expected
  ${"2120202014130200"} | ${[0.0, 1.1]}
  ${"1234"}             | ${[1.6, 2.6]}
  ${"2"}                | ${[2.0, 3.0]}
  ${"3"}                | ${[3.0, 4.0]}
  ${"4"}                | ${[4.0, 5.0]}
`("above for $a ordinals to be $expected", ({ a, expected }) => {
  expect(placeItAbove(a)).toStrictEqual(expected);
});

test.each`
  a                     | expected
  ${"2120202014130200"} | ${[1.1, 2.3]}
  ${"1"}                | ${[2.0, 3.0]}
  ${"2"}                | ${[3.0, 4.0]}
  ${"3"}                | ${[4.0, 5.0]}
  ${"4"}                | ${[5.0, 6.0]}
`("below for $a ordinals to be $expected", ({ a, expected }) => {
  expect(placeItBelow(a)).toStrictEqual(expected);
});

const putItBelowInSortedTasks = putItBelow(mockUpTasks);

test("it should be 1.35 and 1.1", () => {
  expect(putItBelow("1234")("2120202014130200")(mockUpTasks)).toStrictEqual([
    1.1,
    1.6,
  ]);
});

import {
  takeOrdinalNumbers,
  TaskPlacement,
  curry,
  putItBelow,
  ensureThatOrdinalIsFloat,
} from "../api";
import { Task } from "../types";

const mockUpTasks = require("./mockup-takeOrdinalNumbers.json");
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

test.each`
  a             | expected
  ${[1, 0]}     | ${[0.1, 1.0]}
  ${[1, 1.5]}   | ${[1, 1.5]}
  ${[1.5, 1.6]} | ${[1.5, 1.6]}
  ${[1.6, 2.0]} | ${[1.6, 2.0]}
  ${[2.0, 3.0]} | ${[2.1, 3.0]}
`("$a should be changed to $expected", ({ a, expected }) => {
  expect(ensureThatOrdinalIsFloat(a)).toStrictEqual(expected);
});

const placeItAbove = (idOfEventTarget: string) =>
  takeOrdinalsNumbersFromMockupFor3rdTask(idOfEventTarget, TaskPlacement.Above);
const placeItBelow = (idOfEventTarget: string) =>
  takeOrdinalsNumbersFromMockupFor3rdTask(idOfEventTarget, TaskPlacement.Below);
test.each`
  a      | expected
  ${"1"} | ${[0.1, 1.0]}
  ${"2"} | ${[1.0, 1.5]}
  ${"3"} | ${[1.5, 1.6]}
  ${"4"} | ${[2.1, 3.0]}
  ${"5"} | ${[1.6, 2.0]}
`("above for $a ordinals to be $expected", ({ a, expected }) => {
  expect(placeItAbove(a)).toStrictEqual(expected);
});

test.each`
  a      | expected
  ${"5"} | ${[2.1, 3.0]}
  ${"1"} | ${[1.0, 1.5]}
  ${"2"} | ${[1.5, 1.6]}
  ${"3"} | ${[1.6, 2.0]}
  ${"4"} | ${[3.1, 4.0]}
`("below for $a ordinals to be $expected", ({ a, expected }) => {
  expect(placeItBelow(a)).toStrictEqual(expected);
});

const putItBelowInSortedTasks = putItBelow(mockUpTasks);

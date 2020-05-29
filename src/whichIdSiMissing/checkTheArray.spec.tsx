import { Task } from "../types";
import { array } from "prop-types";
export const arrayOfTasks: Task[] = require("./arrayOfTasks.json");

const arrayBefore: Task[] = require("./before.json");
const arrayAfter: Task[] = require("./before.json");

const arrayOfIds = arrayAfter.map((d) => d.frontEndId);
console.log(arrayOfIds);
const newArray = arrayBefore.filter((t) => arrayOfIds.includes(t.frontEndId));

console.log(newArray);

test("something", () => {
	10;
});

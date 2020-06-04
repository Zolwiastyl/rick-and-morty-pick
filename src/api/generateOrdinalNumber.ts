import { Task } from "../types";
import { curry } from "./api";

export enum TaskPlacement {
	Above,
	Below,
}

export function takeOrdinalNumbers(
	wherePlaceTask: TaskPlacement,
	idOfDraggedTask: string,
	idOfEventTarget: string,
	tasks: Task[]
): Array<number> | undefined | string {
	const theArray: Array<number> = [];
	const indexOfDragged = tasks.findIndex(
		(t) => t.frontEndId === idOfDraggedTask
	);
	const sortedTasksGroup = tasks
		.filter(
			(t) =>
				t.status ===
				tasks.filter((t) => t.frontEndId === idOfEventTarget)[0].status
		)
		.sort((x, y) => x.ordinalNumber - y.ordinalNumber);
	const indexOfDrop = sortedTasksGroup.findIndex(
		(t) => t.frontEndId === idOfEventTarget
	);
	if (wherePlaceTask === TaskPlacement.Below) {
		if (indexOfDrop === sortedTasksGroup.length - 1) {
			theArray.push(sortedTasksGroup[indexOfDrop].ordinalNumber);
			theArray.push(sortedTasksGroup[indexOfDrop].ordinalNumber + 1);
			return ensureThatOrdinalIsFloat(theArray);
		}
		if (indexOfDrop + 1 === indexOfDragged) {
			const secondTaskOrdinal =
				sortedTasksGroup[indexOfDrop + 1].ordinalNumber;
			theArray.push(sortedTasksGroup[indexOfDrop].ordinalNumber);
			theArray.push(secondTaskOrdinal);
			return ensureThatOrdinalIsFloat(theArray);
		} else {
			theArray.push(sortedTasksGroup[indexOfDrop].ordinalNumber);
			theArray.push(sortedTasksGroup[indexOfDrop + 1].ordinalNumber);
			return ensureThatOrdinalIsFloat(theArray);
		}
	} else if (wherePlaceTask === TaskPlacement.Above) {
		if (indexOfDrop === 0) {
			theArray.push(0);
			theArray.push(sortedTasksGroup[indexOfDrop].ordinalNumber);
			return ensureThatOrdinalIsFloat(theArray);
		} else {
			theArray.push(sortedTasksGroup[indexOfDrop - 1].ordinalNumber);
			theArray.push(sortedTasksGroup[indexOfDrop].ordinalNumber);
			return ensureThatOrdinalIsFloat(theArray);
		}
	}
}

const curriedtakeOrdinalNumbers = curry(takeOrdinalNumbers);
/**takes id: 1. of dragged task 2. dropped task, and all tasks array*/
export const putItAbove = curriedtakeOrdinalNumbers(TaskPlacement.Above);
/**takes id: 1. of dragged task 2. dropped task, and all tasks array*/
export const putItBelow = curriedtakeOrdinalNumbers(TaskPlacement.Below);

/**takes ids of dragged and dropped task, and all tasks array*/
export function ensureThatOrdinalIsFloat(ordinals: Array<number>) {
	ordinals.sort();
	if (ordinals.reduce((acc, x) => (acc += x)) % 1 === 0) {
		console.log(ordinals + " need to be changed");
		ordinals[0] += 0.1;
		console.log(ordinals + " here there are changed");
		return ordinals;
	} else {
		return ordinals;
	}
}

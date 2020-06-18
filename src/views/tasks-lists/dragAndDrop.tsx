import { group } from "console";

import { callApi } from "../../api/api";
import { putItAbove, putItBelow } from "../../api/generateOrdinalNumber";
import { curriedMoveToAnotherColumn } from "../../api/moveToAnotherGroup";
import { GroupStateProps, Status, TasksStateProps } from "../../types";

/**
 *
 * @param event on which it will work
 * @param state in brackets - tasks and setTasks
 * @param client client from Auth0
 * @param status of group in which it is triggered
 */

export function handleDrop(
	event: React.DragEvent<HTMLElement>,
	{ tasks, setTasks }: TasksStateProps,
	{ groups, setGroups }: GroupStateProps,
	client: any,
	status: Status
) {
	event.preventDefault();
	const itemId = event.dataTransfer.getData("text/plain");
	if (
		event.pageY - event.currentTarget.offsetTop >
		event.currentTarget.offsetHeight / 2
	) {
		const ordinals = putItBelow(itemId)(event.currentTarget.id)(tasks);
		console.log(ordinals[0]);
		const itemToSave = () => {
			return tasks.filter((task) => task.frontEndId === itemId)[0]
				? {
						...tasks.filter((task) => task.frontEndId === itemId)[0],
						ordinalNumber: (ordinals[0] + ordinals[1]) / 2,
				  }
				: {
						...groups.filter((group) => group.groupId === itemId)[0],
						ordinalNumber: ordinals[0] + ordinals[1] / 2,
				  };
		};
		callApi(
			client,
			curriedMoveToAnotherColumn({ tasks, setTasks, groups, setGroups })(
				status.statusName
			)(itemToSave)
		);
	} else {
		const ordinals = putItAbove(itemId)(event.currentTarget.id)(tasks);
		console.log(ordinals[0]);

		const newOrdinal = () => {
			if (ordinals) {
				return ordinals[0] + ordinals[1];
			}
		};
		const itemToSave = () => {
			return tasks.filter((task) => task.frontEndId === itemId)[0]
				? {
						...tasks.filter((task) => task.frontEndId === itemId)[0],
						ordinalNumber: newOrdinal(),
				  }
				: {
						...groups.filter((group) => group.groupId === itemId)[0],
						ordinalNumber: newOrdinal(),
				  };
		};
		callApi(
			client,
			curriedMoveToAnotherColumn({ tasks, setTasks, groups, setGroups })(
				status.statusName
			)(itemToSave)
		);
		console.log(itemToSave);
	}
	console.log("dragged");
}

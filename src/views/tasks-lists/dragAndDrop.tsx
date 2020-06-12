import { callApi } from "../../api/api";
import { putItAbove,putItBelow } from "../../api/generateOrdinalNumber";
import { curriedMoveToAnotherGroup } from "../../api/moveToAnotherGroup";
import { Status,TasksStateProps } from "../../types";

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
	client: any,
	status: Status
) {
	event.preventDefault();
	const taskId = event.dataTransfer.getData("text/plain");
	if (
		event.pageY - event.currentTarget.offsetTop >
		event.currentTarget.offsetHeight / 2
	) {
		const ordinals = putItBelow(taskId)(event.currentTarget.id)(tasks);
		console.log(ordinals[0]);
		const taskToSave = {
			...tasks.filter((task) => task.frontEndId === taskId)[0],
			ordinalNumber: (ordinals[0] + ordinals[1]) / 2,
		};
		callApi(
			client,
			curriedMoveToAnotherGroup({ tasks, setTasks })(status.statusName)(
				taskToSave
			)
		);
	} else {
		const ordinals = putItAbove(taskId)(event.currentTarget.id)(tasks);
		console.log(ordinals[0]);

		const newOrdinal = () => {
			if (ordinals) {
				return ordinals[0] + ordinals[1];
			}
		};
		const taskToSave = {
			...tasks.filter((task) => task.frontEndId === taskId)[0],
			ordinalNumber: newOrdinal(),
		};
		callApi(
			client,
			curriedMoveToAnotherGroup({ tasks, setTasks })(status.statusName)(
				taskToSave
			)
		);
		console.log(taskToSave);
	}
	console.log("dragged");
}

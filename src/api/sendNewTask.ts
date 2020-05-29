import { Task } from "../types";
import { curry, HOST } from "./api";

const newTaskPostURL = new Request(HOST + "/tasks");

export function sendNewTask(task: Partial<Task>, token: any) {
	return plainSendNewTask(task, token, newTaskPostURL);
}

export const curriedSendNewTask: Function = curry(sendNewTask);
export async function plainSendNewTask(
	task: Partial<Task>,
	token: any,
	url: Request
) {
	async function sendTask() {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: task.name,
				status: task.status,
				frontEndId: task.frontEndId,
				dependencyId: task.dependencyId,
				isReady: task.isReady,
				userId: task.userId,
				dependOnThisTask: task.dependOnThisTask,
				ordinalNumber: task.ordinalNumber,
			}),
		});

		return response;
	}

	return sendTask()
		.then((response) => {
			const success = response.ok;
			const code = response.status;
			if (!success) {
				throw (
					"sending task " +
					task.name! +
					" failed" +
					"/n" +
					"response code: " +
					code.toString()
				);
			} else {
				return success;
			}
		})
		.catch((error) => {
			console.log("problem with fetching data:", error);
			return false;
		});
}

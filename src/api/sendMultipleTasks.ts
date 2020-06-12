import { Task } from "../types";
import { curry,HOST } from "./api";

export const curriedSendMultipleTasks: Function = curry(sendMultipleTasks);
const sendMultipleTasksURL = new Request(HOST + "/multiple-tasks");
export async function plainSendMultipleTasks(
	tasks: Task[],
	token: any,
	url: Request
) {
	async function sendTasks() {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tasks),
		});
		return response;
	}
	return sendTasks()
		.then((isSuccess) => {
			if (!isSuccess.ok) {
				throw Error(isSuccess.statusText);
			} else {
				return isSuccess;
			}
		})
		.catch((error) => {
			console.log("problem with fetching data:", error);
			return false;
		});
}

function sendMultipleTasks(tasks: Task[], token: any) {
	return plainSendMultipleTasks(tasks, token, sendMultipleTasksURL);
}

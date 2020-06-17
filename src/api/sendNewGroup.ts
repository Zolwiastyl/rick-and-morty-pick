import { GroupOfTasks } from "../types";
import { curry, HOST } from "./api";

const newGroupPostUrl = new Request(HOST + "/group");

function sendNewGroup(group: GroupOfTasks, token: string) {
	return plainSendNewGroup(group, token, newGroupPostUrl);
}

export const curriedSendNewGroup = curry(sendNewGroup);
async function plainSendNewGroup(
	group: Partial<GroupOfTasks>,
	token: string,
	url: Request
) {
	return fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			groupId: group.groupId,
			groupName: group.groupName,
			TasksIds: group.TasksIds,
			ordinalNumber: group.ordinalNumber,
			userId: group.userId,
			status: group.status,
		}),
	}).then((response) => {
		const success = response.ok;
		const code = response.status;
		if (!success) {
			throw new Error(
				"sending task " +
					group.groupName! +
					" failed" +
					"/n" +
					"response code: " +
					code.toString
			);
		} else {
			return success;
		}
	});
}

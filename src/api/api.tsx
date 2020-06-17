import { Auth0Client } from "@auth0/auth0-spa-js";
import React from "react";

import { GroupOfTasks, Task } from "../types";

export const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";
const tasksRequest = new Request(HOST + "/tasks");
const groupsRequest = new Request(HOST + "/groups");

export async function callApi(
	client: Auth0Client | undefined,
	partialCallBack: Function
) {
	try {
		const token = await client?.getTokenSilently();
		return await partialCallBack(token);
	} catch (error) {
		console.error(error);
	}
}

export function curry(fn: Function): Function {
	return function curried(...args: any[]) {
		if (args.length >= fn.length) {
			return fn(...args);
		} else {
			return function (a: any) {
				return curried(...[...args, a]);
			};
		}
	};
}

type FetchingDataArguments = {
	setState:
		| React.Dispatch<React.SetStateAction<Task[]>>
		| React.Dispatch<React.SetStateAction<GroupOfTasks[]>>;
	token: any;
	url: Request;
};
export const fetchTasksFromServer = ({
	setState,
	token,
}: Partial<FetchingDataArguments>) => {
	return setState
		? fetchDataFromServer({
				setState: setState,
				token: token,
				url: tasksRequest,
		  })
		: null;
};
export const fetchGroupsFromServer = ({
	setState,
	token,
}: Partial<FetchingDataArguments>) => {
	return setState
		? fetchDataFromServer({
				setState: setState,
				token: token,
				url: tasksRequest,
		  })
		: null;
};

function fetchDataFromServer({ setState, token, url }: FetchingDataArguments) {
	fetch(url, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const newArray = { data };
			const newData = newArray.data;
			setState(newData);
		})
		.catch((error) => console.log("We had en error" + error));
}

/*{() => {
				fetch(HOST + "/remove-data", {
					method: "POST",
				}); */
export function removeAllData() {
	fetch(HOST + "/remove-data", {
		method: "POST",
	});
}

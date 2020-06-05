import { Task, TasksStateProps } from "../types";
import React from "react";

import { Auth0Client } from "@auth0/auth0-spa-js";
import { Button } from "../reusable-ui/Button";

export const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";
const tasksRequest = new Request(HOST + "/tasks");

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

export function fetchDataFromServer(
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
	token: any
) {
	fetch(tasksRequest, {
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
			setTasks(newData);
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

export function renderIcon(
	Icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}> | undefined
) {
	if (Icon) {
		return <Icon />;
	}
}

export type IconType = typeof renderIcon;

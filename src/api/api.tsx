import react from "react";
import { Task, TasksStateProps } from "../types";
import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { any, string, number } from "prop-types";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { resolve } from "dns";

export const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";
const tasksRequest = new Request(HOST + "/tasks");

export async function callApi(
	client: Auth0Client | undefined,
	partialCallBack: Function
) {
	async function callApi() {
		try {
			const token = await client?.getTokenSilently();
			return await partialCallBack(token);
		} catch (error) {
			console.error(error);
		}
	}

	return await callApi();
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

export function RemoveAllData(props: Partial<TasksStateProps>) {
	return (
		<button
			className="remove-data-button"
			onClick={() => {
				fetch(HOST + "/remove-data", {
					method: "POST",
				});
			}}
		>
			// REMOVE ALL DATA //
		</button>
	);
}

export function renderIcon(
	Icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}> | undefined
) {
	if (Icon) {
		return <Icon />;
	}
}
function checkIfTaskIsReady(task: Task, tasks: Task[], token: any) {
	console.log(
		task.dependencyId?.map((id) =>
			tasks.filter((task) => task.frontEndId == id)
		)
	);
}

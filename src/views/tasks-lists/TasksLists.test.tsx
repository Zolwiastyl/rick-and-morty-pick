import "isomorphic-fetch";
import "@testing-library/jest-dom/extend-expect";

import {
	fireEvent,
	getByTestId,
	getByText,
	queryByText,
	render,
} from "@testing-library/react";
import React from "react";

import { Task } from "../../types";
import { TasksLists } from "./TasksLists";

const tasksArray: Task[] = [
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task5Id",
		isReady: false,
		name: "Defeat Thanos",
		ordinalNumber: 0.065625,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task6Id",
		isReady: false,
		name: "Don't defeat Thanos",
		ordinalNumber: 0.0328125,
		status: "todo",
		userId: "github|45352717",
		description: "just don't do it",
	},
];

const mockSetTasks: React.Dispatch<React.SetStateAction<Task[]>> = () => {};

test("expect second task to be displayed", async () => {
	const { container } = render(
		<TasksLists tasks={tasksArray} setTasks={mockSetTasks} />
	);
	expect(getByText(container, "Defeat Thanos")).toBeInTheDocument();
});
test("Task Card opens and closes when chevron is clicked", async () => {
	const { container } = render(
		<TasksLists tasks={tasksArray} setTasks={mockSetTasks} />
	);
	const secondTaskButton = getByTestId(container, "Task6Id-toggle");
	fireEvent.click(secondTaskButton);
	expect(getByText(container, "just don't do it")).toBeInTheDOM();
	fireEvent.click(secondTaskButton);
	expect(queryByText(container, "just don't do it")).not.toBeInTheDOM();
});

//samodzielny test - implementacja ma pokazywać asserta
// 3*A A coś tam Act Assert
